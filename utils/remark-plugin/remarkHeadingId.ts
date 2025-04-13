import { Heading, Root, Text } from "mdast";
import { selectAll } from "unist-util-select";

interface HeadingIdOptions {
	maxDepth: number;
}

function generateId(map: Map<string, number>, text: Text[]): string {

	const id = text
		.map((it) => it.value)
		.join()
		// replace all spaces with -
		.replace(/ /g, "-");

	if (map.has(id)) {
		map.set(id, map.get(id)! + 1);
		return `${id}-${map.get(id)}`;
	} else {
		map.set(id, 0);
		return id;
	}
}

export default function remarkHeadingId(props: HeadingIdOptions = {maxDepth: 6}) {
	return (root: Root) => {

		const headings = selectAll("heading", root) as Heading[];
		const idMap = new Map<string, number>();

		headings.forEach((heading) => {

			if(heading.depth > props.maxDepth)
				return;

			const text = selectAll("text", heading) as Text[];

			let id = text
				.map((it) => it.value)
				.join()
				// replace all spaces with -
				.replace(/ /g, "-");

			if (idMap.has(id)) {
				idMap.set(id, idMap.get(id)! + 1);
				id = `${id}-${idMap.get(id)}`;
			} else {
				idMap.set(id, 0);
			}

			heading.data = {
				hProperties: {
					id,
				},
			};
		});

	}
}

export function generateToc(ast: Root) {

	const headings = selectAll("heading", ast) as Heading[];
	const idMap = new Map<string, number>();

	return headings.map((heading) => {

		const text = selectAll("text", heading) as Text[];
		const id = generateId(idMap, text);

		return {
			depth: heading.depth,
			id,
			text: text.map((it) => it.value).join(),
		};
	});
}