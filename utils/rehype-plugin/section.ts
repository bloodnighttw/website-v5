import { Element, Root, RootContent, Text as HText } from "hast";
import { Text as MText } from "mdast";
import { selectAll } from "unist-util-select";

type Text = HText | MText;
function sanitizeHtmlId(input?: string) {
	if (!input) return "";

	// First character must be a letter (including Chinese characters)
	let result = "";
	const firstChar = input.charAt(0);

	// Check if first character is a letter (including unicode letters like Chinese)
	if (/^[a-zA-Z\u4e00-\u9fa5]$/.test(firstChar)) {
		result = firstChar;
	} else {
		// If first character is invalid, start with "id-"
		result = "id-";
	}

	// Process the rest of the string
	for (let i = result === "id-" ? 0 : 1; i < input.length; i++) {
		const char = input.charAt(i);
		// Valid characters: letters (including Chinese), digits, hyphens, underscores, periods
		if (/^[a-zA-Z0-9\u4e00-\u9fa5\-_.]$/.test(char)) {
			result += char;
		} else {
			// Replace invalid chars with hyphen
			result += "-";
		}
	}

	return result;
}

export function generateId(map: Map<string, number>, text: Text[]): string {
	const combinedText = text.map((it) => it.value).join();

	const id = sanitizeHtmlId(combinedText);

	if (map.has(id)) {
		map.set(id, map.get(id)! + 1);
		return `${id}-${map.get(id)}`;
	} else {
		map.set(id, 0);
		return id;
	}
}

function plugin() {
	return transform;
}

const headingsRegex = /^(h[1-6])$/;

function getAllHeadings(tree: Root): Element[] {
	return tree.children.filter(
		(node) => node.type === "element" && headingsRegex.test(node.tagName),
	) as Element[];
}

function transform(tree: Root) {
	const idMap = new Map<string, number>();
	const headings = getAllHeadings(tree);

	for (let i = 0; i < headings.length; i++) {
		const current = headings[i];
		const currentIndex = tree.children.indexOf(current);

		const next = headings[i + 1];
		const nextIndex = next ? tree.children.indexOf(next) : undefined;

		const between = tree.children.slice(currentIndex, nextIndex);

		const text = selectAll("text", current) as Text[];
		const id = generateId(idMap, text);

		const section = {
			type: "element",
			tagName: "section",
			properties: {
				id,
			},
			children: between,
		};

		tree.children.splice(
			currentIndex,
			between.length,
			section as RootContent,
		);
	}
}

export default plugin;
