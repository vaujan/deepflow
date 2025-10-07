"use client";

import React from "react";
import { MilkdownProvider, Milkdown, useEditor } from "@milkdown/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { listener, listenerCtx } from "@milkdown/plugin-listener";

interface MilkdownEditorProps {
	content: string;
	onChange: (markdown: string) => void;
	placeholder?: string; // reserved for future use
	editable?: boolean;
	className?: string;
	onKeyDown?: (event: KeyboardEvent) => void;
	autoFocus?: boolean; // reserved for future use
}

function MilkdownEditorInner({
	content,
	onChange,
	placeholder,
	editable = true,
	className = "",
	onKeyDown,
	autoFocus,
}: MilkdownEditorProps) {
	const onChangeRef = React.useRef(onChange);
	const onKeyDownRef = React.useRef(onKeyDown);
	React.useEffect(() => {
		onChangeRef.current = onChange;
		onKeyDownRef.current = onKeyDown;
	}, [onChange, onKeyDown]);

	useEditor(
		(root) =>
			Editor.make()
				.config((ctx) => {
					ctx.set(rootCtx, root);
					ctx.set(defaultValueCtx, content ?? "\n");
				})
				.use(commonmark)
				.use(listener)
				.config((ctx) => {
					const l = ctx.get(listenerCtx);
					l.markdownUpdated((_, md) => onChangeRef.current?.(md));
				}),
		[]
	);
	return (
		<div
			className={className}
			data-milkdown-wrapper
			onKeyDown={(e) => {
				if ((e.key === "Enter" && e.shiftKey) || e.key === "Escape") {
					onKeyDownRef.current?.(e.nativeEvent as unknown as KeyboardEvent);
				}
			}}
		>
			<Milkdown />
		</div>
	);
}

export default function MilkdownEditor(props: MilkdownEditorProps) {
	return (
		<MilkdownProvider>
			<MilkdownEditorInner {...props} />
		</MilkdownProvider>
	);
}
