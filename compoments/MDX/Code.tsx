import "server-only";
import { readFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { codeToHtml } from "shiki";

interface Props {
	// file path from the root of the content folder
	filepath: string;
	language?: string;
}

// show file code under the code block
export default async function Code(props: Props) {

	const { filepath, language } = props;

	const totalPath = join(cwd(), "contents", "codes", filepath);
	const fileExt = filepath.split(".").pop();


	const content = await readFile(totalPath, "utf-8");

	const out = await (codeToHtml(content, {
		lang: language ?? fileExt ?? "plaintext",
		theme: "catppuccin-mocha",
		colorReplacements: {
			"#1e1e2e": "#18181B",
		}
	}))


	return <div dangerouslySetInnerHTML={{__html:out}} /> ;
}
