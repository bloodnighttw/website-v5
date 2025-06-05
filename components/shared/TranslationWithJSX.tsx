import React, { Fragment } from "react";

interface Props {
	text: string;
	icon: {
		[key: string]: React.ReactElement;
	};
	args?: Record<string, string | number | Date>;
}

// replace #key with the value(component) from text
export default async function TranslationWithIcon(props: Props) {
	const { text, icon } = props;
	const result = text.split(/#(\w+)#/g).map((part, index) => {
		const key = part;
		const value = icon[key];
		if (value) {
			return <Fragment key={index}>{value}</Fragment>;
		} else {
			return <Fragment key={index}>{key}</Fragment>;
		}
	});

	return (
		<p className="mt-2 text-balance lg:text-wrap text-xl *:inline *:align-text-bottom fade-in-up">
			{result}
		</p>
	);
}
