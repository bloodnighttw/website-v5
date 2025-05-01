import { Heading, Node, Root, RootContent, Text } from "mdast";
import { selectAll } from "unist-util-select";

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

export function generateToc(ast: Root) {

	const headings = selectAll("heading", ast) as Heading[];
	const idMap = new Map<string, number>();

	return headings.map((heading) => {

		const text = selectAll("text", heading) as Text[];
		const id = generateId(idMap, text);

		return {
			depth: heading.depth,
			id,
			text: text.map((it) => it.value).join()
		};
	});
}

interface Section{
	type: 'section',
	data: {
		hName: 'section',
		hProperties: {
			id: string
		}
	},
	children: Node[]
}

function plugin () {
	return transform
}

function getHeadingList (tree:Root) {
	return selectAll('heading', tree) as Heading[]
}

function transform (tree:Root) {
	const headings = getHeadingList(tree)
	const sections: Section[] = [];

	const idMap = new Map<string, number>();

	for(let i = 0; i < headings.length; i++) {

		const current = headings[i];
		const currentIndexFromChildren = tree.children.indexOf(current);

		const next = headings[i + 1];
		const nextIndexFromChildren = next ? tree.children.indexOf(next) : undefined;

		const between = tree.children.slice(currentIndexFromChildren, nextIndexFromChildren);

		const id = generateId(idMap, selectAll('text', current) as Text[]);

		const section: Section = {
			type: 'section',
			data: {
				hName: 'section',
				hProperties: {
					id
				}
			},
			children: between
		}

		sections.push(section)
	}

	tree.children = sections as unknown as RootContent[];

}


export default plugin
