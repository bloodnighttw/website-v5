import { ComponentProps, createElement, ReactNode } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import { Content, MkblogPlugin } from "@mkblog/core";
import { imageSize } from "image-size";
import { selectAll } from "unist-util-select";
import {Element} from "hast";

declare module "@mkblog/core" {
	interface Content<T> {
		react: () => Promise<ReactNode>;
	}
}

export async function getImageSize(
	url: string,
): Promise<{ width: number; height: number } | undefined> {
	try {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return imageSize(Buffer.from(arrayBuffer));
	} catch (error) {
		console.error("Error fetching image size:", error);
	}
}

interface SrcMapping{
	[src:string]: {width:number, height:number}
}

let imageSizeMapping: SrcMapping = {};

const nextImageTransform = {
	img: (props: ComponentProps<"img">) => {
		return createElement(Image, {
			...(props as { src: string }),
			loading: "eager",
			width: imageSizeMapping[props.src!].width,
			height: imageSizeMapping[props.src!].height,
			alt: props.alt ?? "image from bntw.dev",
		});
	},
};

export const nextImagePlugin: MkblogPlugin = {
	init: () => {
		Content.prototype.react = async function () {
			const hast = await this.hast();
			const temp  = selectAll("element",hast) as Element[];

			imageSizeMapping = {} // reset

			const addMapping = async (src:string)=>{
				const dim = await getImageSize(src)
				imageSizeMapping[src] = dim!;
			}

			const tasks = temp.map(async it=>{
				if(it.tagName === "img"){
					const src = it.properties!["src"] as string;
					return addMapping(src)
				}
			})

			await Promise.all(tasks)

			return toJsxRuntime(hast, {
				...runtime,
				components: nextImageTransform,
			});
		};
	},
};