import React from "react";

interface Props {
	text: string;
	icon: {
		[key: string]: React.ReactElement;
	},
	args?: Record<string, string | number | Date>;
}

// replace #key with the value(component) from text
export default async function TranslationWithIcon(props: Props) {

	const { text, icon } = props;
	const result = text.split(/#(\w+)#/g).map((part, index) => {
		const key = part;
		const value = icon[key];
		if (value) {
			return <span key={index} className="*:inline">{value}</span>;
		} else {
			return <span key={index}>{key}</span>;
		}
	});

	return (
		<p className="text-xl mt-2 text-balance lg:text-wrap">
			{result}
		</p>
	);

}