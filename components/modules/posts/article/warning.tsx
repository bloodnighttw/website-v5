interface Props {
	title: string;
	message: string;
}

// a warning component with glare effect on background
export default function Warning(props: Props) {
	return (
		<div className="rounded p-4 bg-gradient-to-br from-red-500/60 to-red-900/60 relative shadow-lg shadow-bsecondary mb-8">
			<span className="font-bold flex items-center gap-2 *:h-4 text-[16px]">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					className="bi bi-exclamation-circle-fill"
					viewBox="0 0 16 16"
				>
					<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
				</svg>
				{props.title}
			</span>
			<p className="mt-2 mb-0">{props.message}</p>
		</div>
	);
}
