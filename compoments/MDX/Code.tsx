import "server-only";

import { readFileSync } from "fs";
import path from "node:path";
import {all, createStarryNight} from '@wooorm/starry-night'
import { starryNightGutter } from "@/utils/rehype-plugin/line-numbers";
import { unified } from "unified";
import rehypeStringify from "rehype-stringify";


interface Props{
	// file path from the root of the content folder
	filepath: string;
	language?: string;
}

// show file code under the code block
export default async function Code(props: Props) {

	const actualPath = path.join(process.cwd(),"contents","codes", props.filepath);
	const rawText = readFileSync(actualPath, "utf8");

	const ext = props.filepath.split(".").pop()!;

	const starryNight = await createStarryNight(all)

	const scope = starryNight.flagToScope(props.language ?? ext)
	const tree = starryNight.highlight(rawText, scope!)

	// apply line number
	// @ts-expect-error it works
	starryNightGutter(tree);

	const html = unified()
			.use(rehypeStringify)
			.stringify(tree)


	return <pre>
		<code dangerouslySetInnerHTML={{__html:html}}/>
	</pre>;
}