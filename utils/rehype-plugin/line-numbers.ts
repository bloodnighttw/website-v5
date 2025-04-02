import type { Element, ElementContent } from "hast";
import type { Plugin } from "unified";
import { selectAll } from "unist-util-select";

export function starryNightGutter(tree: Element): void {
	const replacement: ElementContent[] = [];
	const search = /\r?\n|\r/g;
	let index = -1;
	let start = 0;
	let startTextRemainder = "";
	let lineNumber = 0;

	while (++index < tree.children.length) {
		const child = tree.children[index];

		if (child.type === "text") {
			let textStart = 0;
			let match = search.exec(child.value);

			while (match) {
				// Nodes in this line.
				const line = tree.children.slice(
					start,
					index,
				) as ElementContent[];

				// Prepend text from a partial matched earlier text.
				if (startTextRemainder) {
					line.unshift({ type: "text", value: startTextRemainder });
					startTextRemainder = "";
				}

				// Append text from this text.
				if (match.index > textStart) {
					line.push({
						type: "text",
						value: child.value.slice(textStart, match.index),
					});
				}

				// Add a line, and the eol.
				lineNumber += 1;
				replacement.push(createLine(line, lineNumber), {
					type: "text",
					value: match[0],
				});

				start = index + 1;
				textStart = match.index + match[0].length;
				match = search.exec(child.value);
			}

			// If we matched, make sure to not drop the text after the last line ending.
			if (start === index + 1) {
				startTextRemainder = child.value.slice(textStart);
			}
		}
	}

	const line = tree.children.slice(start) as ElementContent[];
	// Prepend text from a partial matched earlier text.
	if (startTextRemainder) {
		line.unshift({ type: "text", value: startTextRemainder });
	}

	if (line.length > 0) {
		lineNumber++;
		replacement.push(createLine(line, lineNumber));
	}

	// Replace children with new array.
	tree.children = replacement;
}

function createLine(children: ElementContent[], line: number): Element {
	return {
		type: "element",
		tagName: "span",
		properties: { className: "line", dataLineNumber: line },
		children,
	};
}

// Rehype plugin wrapper
const rehypeLineNumbers: Plugin<[], Element> = () => {
	return (tree: Element) =>
		selectAll("element", tree).forEach((node) => {
			// node must be an element
			const element = node as Element;
			if (element.tagName === "pre") {
				for (const child of element.children) {
					const childElement = child as Element;
					if (childElement.tagName === "code") {
						starryNightGutter(childElement);
					}
				}
			}
		});
};

export default rehypeLineNumbers;
