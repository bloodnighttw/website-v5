

interface Props {
	children: React.ReactNode;
	className?: string;
}


export default function ScrollContainer(props: Props) {
	// 評價數據

	return (
		<div className={"overflow-hidden scrolling sm:w-96 "+props.className}>
			<div>{props.children}</div>
			<div>{props.children}</div>
		</div>
	);
};