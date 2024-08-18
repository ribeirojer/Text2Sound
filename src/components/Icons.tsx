import React from "react";

type Props = {
	className?: string;
	alt?: string;
};

export const DownloadIcon = (props: Props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			className={props.className}
		>
			<g data-name="Layer 2">
				<g data-name="download">
					<rect width="24" height="24" opacity="0" />
					<rect x="4" y="18" width="16" height="2" rx="1" ry="1" />
					<rect
						x="3"
						y="17"
						width="4"
						height="2"
						rx="1"
						ry="1"
						transform="rotate(-90 5 18)"
					/>
					<rect
						x="17"
						y="17"
						width="4"
						height="2"
						rx="1"
						ry="1"
						transform="rotate(-90 19 18)"
					/>
					<path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z" />
					<path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z" />
				</g>
			</g>
		</svg>
	);
};

export const SyncIcon = (props: Props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			className={props.className}
		>
			<g data-name="Layer 2">
				<g data-name="sync">
					<rect width="24" height="24" opacity="0" />
					<path d="M21.66 10.37a.62.62 0 0 0 .07-.19l.75-4a1 1 0 0 0-2-.36l-.37 2a9.22 9.22 0 0 0-16.58.84 1 1 0 0 0 .55 1.3 1 1 0 0 0 1.31-.55A7.08 7.08 0 0 1 12.07 5a7.17 7.17 0 0 1 6.24 3.58l-1.65-.27a1 1 0 1 0-.32 2l4.25.71h.16a.93.93 0 0 0 .34-.06.33.33 0 0 0 .1-.06.78.78 0 0 0 .2-.11l.08-.1a1.07 1.07 0 0 0 .14-.16.58.58 0 0 0 .05-.16z" />
					<path d="M19.88 14.07a1 1 0 0 0-1.31.56A7.08 7.08 0 0 1 11.93 19a7.17 7.17 0 0 1-6.24-3.58l1.65.27h.16a1 1 0 0 0 .16-2L3.41 13a.91.91 0 0 0-.33 0H3a1.15 1.15 0 0 0-.32.14 1 1 0 0 0-.18.18l-.09.1a.84.84 0 0 0-.07.19.44.44 0 0 0-.07.17l-.75 4a1 1 0 0 0 .8 1.22h.18a1 1 0 0 0 1-.82l.37-2a9.22 9.22 0 0 0 16.58-.83 1 1 0 0 0-.57-1.28z" />
				</g>
			</g>
		</svg>
	);
};
export const TrashIcon = (props: Props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			className={props.className}
		>
			<g data-name="Layer 2">
				<g data-name="trash">
					<rect width="24" height="24" opacity="0" />
					<path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
				</g>
			</g>
		</svg>
	);
};
