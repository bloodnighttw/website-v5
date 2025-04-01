/* This file is originally from fumadocs, an docs framework written by
 * @fuma-nama, The original license is MIT.
 */

import * as path from "node:path";
import type { Root } from "mdast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { imageSize } from "image-size";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import type { ISizeCalculationResult } from "image-size/types/interface";
import { imageSizeFromFile } from "image-size/fromFile";

const VALID_BLUR_EXT = [".jpeg", ".png", ".webp", ".avif", ".jpg"];
const EXTERNAL_URL_REGEX = /^https?:\/\//;

/**
 * Split path into segments, trailing/leading slashes are removed
 */
export function splitPath(path: string): string[] {
	return path.split("/").filter((p) => p.length > 0);
}

/**
 * Resolve paths, slashes within the path will be ignored
 * @param paths - Paths to join
 * @example
 * ```
 * ['a','b'] // 'a/b'
 * ['/a'] // 'a'
 * ['a', '/b'] // 'a/b'
 * ['a', '../b/c'] // 'b/c'
 * ```
 */
export function joinPath(...paths: string[]): string {
	const out = [];
	const parsed = paths.flatMap(splitPath);

	while (parsed.length > 0) {
		switch (parsed[0]) {
			case "..":
				out.pop();
				break;
			case ".":
				break;
			default:
				out.push(parsed[0]);
		}

		parsed.shift();
	}

	return out.join("/");
}

export function slash(path: string): string {
	const isExtendedLengthPath = path.startsWith("\\\\?\\");

	if (isExtendedLengthPath) {
		return path;
	}

	return path.replaceAll("\\", "/");
}

export interface RemarkImageOptions {
	/**
	 * Directory or base URL to resolve absolute image paths
	 */
	publicDir?: string;

	/**
	 * Preferred placeholder type
	 *
	 * @defaultValue 'blur'
	 */
	placeholder?: "blur" | "none";

	/**
	 * Import images in the file, and let bundlers handle it.
	 *
	 * ```tsx
	 * import MyImage from "./public/img.png";
	 *
	 * <img src={MyImage} />
	 * ```
	 *
	 * When disabled, `placeholder` will be ignored.
	 *
	 * @defaultValue true
	 */
	useImport?: boolean;

	/**
	 * Fetch image size of external URLs
	 *
	 * @defaultValue true
	 */
	external?: boolean;
}

// Based on the Nextra: https://github.com/shuding/nextra

/**
 * Turn images into Next.js Image compatible usage.
 */
export function remarkNextImage({
	placeholder = "blur",
	external = true,
	useImport = true,
	publicDir = path.join(process.cwd(), "public"),
}: RemarkImageOptions = {}): Transformer<Root, Root> {
	return async (tree, file) => {
		const importsToInject: { variableName: string; importPath: string }[] =
			[];
		const promises: Promise<void>[] = [];

		function getImportPath(src: string): string {
			if (!src.startsWith("/")) return src;
			const to = path.join(publicDir, src);

			if (file.dirname) {
				const relative = slash(path.relative(file.dirname, to));

				return relative.startsWith("./") ? relative : `./${relative}`;
			}

			return slash(to);
		}

		visit(tree, "image", (node) => {
			const url = decodeURI(node.url);
			if (!url) return;
			const isExternal = EXTERNAL_URL_REGEX.test(url);

			if ((isExternal && external) || !useImport) {
				const task = getImageSize(url, publicDir)
					.then((size) => {
						if (!size.width || !size.height) return;
						const cfImage = `/cdn-cgi/image/width=auto,format=auto/${url}`;

						const inDev = process.env.NODE_ENV === "development";

						Object.assign(node, {
							type: "mdxJsxFlowElement",
							name: "img",
							attributes: [
								{
									type: "mdxJsxAttribute",
									name: "alt",
									value: node.alt ?? "image",
								},
								{
									type: "mdxJsxAttribute",
									name: "src",
									value: inDev ? url : cfImage,
								},
								{
									type: "mdxJsxAttribute",
									name: "width",
									value: size.width.toString(),
								},
								{
									type: "mdxJsxAttribute",
									name: "height",
									value: size.height.toString(),
								},
							],
						});
					})
					.catch((e) => {
						console.error(
							`[Remark Image] Failed obtain image size for ${url} with public directory ${publicDir}`,
						);

						throw e;
					});

				promises.push(task);
			} else if (!isExternal) {
				// Unique variable name for the given static image URL
				const variableName = `__img${importsToInject.length.toString()}`;
				const hasBlur =
					placeholder === "blur" &&
					VALID_BLUR_EXT.some((ext) => url.endsWith(ext));

				importsToInject.push({
					variableName,
					importPath: getImportPath(url),
				});

				Object.assign(node, {
					type: "mdxJsxFlowElement",
					name: "img",
					attributes: [
						{
							type: "mdxJsxAttribute",
							name: "alt",
							value: node.alt ?? "image",
						},
						hasBlur && {
							type: "mdxJsxAttribute",
							name: "placeholder",
							value: "blur",
						},
						{
							type: "mdxJsxAttribute",
							name: "src",
							value: {
								type: "mdxJsxAttributeValueExpression",
								value: variableName,
								data: {
									estree: {
										body: [
											{
												type: "ExpressionStatement",
												expression: {
													type: "Identifier",
													name: variableName,
												},
											},
										],
									},
								},
							},
						},
					].filter(Boolean),
				});
			}
		});

		await Promise.all(promises);
		if (importsToInject.length === 0) return;

		const imports = importsToInject.map(
			({ variableName, importPath }) =>
				({
					type: "mdxjsEsm",
					data: {
						estree: {
							body: [
								{
									type: "ImportDeclaration",
									source: {
										type: "Literal",
										value: importPath,
									},
									specifiers: [
										{
											type: "ImportDefaultSpecifier",
											local: {
												type: "Identifier",
												name: variableName,
											},
										},
									],
								},
							],
						},
					},
				}) as MdxjsEsm,
		);

		tree.children.unshift(...imports);
	};
}

async function getImageSize(
	src: string,
	dir: string,
): Promise<ISizeCalculationResult> {
	const isRelative = src.startsWith("/") || !path.isAbsolute(src);
	let url: string;

	if (EXTERNAL_URL_REGEX.test(src)) {
		url = src;
	} else if (EXTERNAL_URL_REGEX.test(dir) && isRelative) {
		const base = new URL(dir);
		base.pathname = joinPath(base.pathname, src);
		url = base.toString();
	} else {
		return imageSizeFromFile(isRelative ? path.join(dir, src) : src);
	}

	const buffer = await fetch(url).then((res) => res.arrayBuffer());

	return imageSize(new Uint8Array(buffer));
}
