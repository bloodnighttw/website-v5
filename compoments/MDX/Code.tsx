import "server-only";
import { readFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

interface Props {
	// file path from the root of the content folder
	filepath: string;
	language?: string;
}

// show file code under the code block
export default async function Code(props: Props) {
	const { filepath, language } = props;

	// Read the file content
	const content = await readFile(join(cwd(), filepath), "utf-8");

	// Split the content into lines
	const lines = content.split("\n");

	return (
		<pre className="relative">
			<code className={language ? `language-${language}` : ""}>
				{lines.map((line, index) => (
					<span key={index} className="line">
						<span className="line-number">{index + 1}</span>
						{line}
					</span>
				))}
			</code>
		</pre>
	);
}
