"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/src/lib/utils";

type TopScrollContainerProps = {
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
};

export default function TopScrollContainer({
	children,
	className,
	contentClassName,
}: TopScrollContainerProps) {
	const contentRef = useRef<HTMLDivElement | null>(null);
	const topScrollRef = useRef<HTMLDivElement | null>(null);
	const topInnerRef = useRef<HTMLDivElement | null>(null);
	const syncingRef = useRef(false);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		const contentEl = contentRef.current;
		const topEl = topScrollRef.current;
		const topInnerEl = topInnerRef.current;
		if (!contentEl || !topEl || !topInnerEl) return;

		const syncTopWidth = () => {
			topInnerEl.style.width = `${contentEl.scrollWidth}px`;
		};

		syncTopWidth();

		const onTopScroll = () => {
			if (syncingRef.current) return;
			syncingRef.current = true;
			contentEl.scrollLeft = topEl.scrollLeft;
			syncingRef.current = false;
		};

		const onContentScroll = () => {
			if (syncingRef.current) return;
			syncingRef.current = true;
			topEl.scrollLeft = contentEl.scrollLeft;
			syncingRef.current = false;
		};

		topEl.addEventListener("scroll", onTopScroll, { passive: true });
		contentEl.addEventListener("scroll", onContentScroll, { passive: true });

		// Keep the synthetic track width in sync with content size changes
		if ("ResizeObserver" in window) {
			const ro = new ResizeObserver(() => {
				syncTopWidth();
			});
			ro.observe(contentEl);
			resizeObserverRef.current = ro;
		} else {
			const id = window.setInterval(syncTopWidth, 250);
			// Use ref to store the interval id for cleanup via same path
			(resizeObserverRef as any).current = {
				disconnect: () => window.clearInterval(id),
			};
		}

		return () => {
			topEl.removeEventListener("scroll", onTopScroll);
			contentEl.removeEventListener("scroll", onContentScroll);
			resizeObserverRef.current?.disconnect();
		};
	}, []);

	return (
		<div className={cn("relative w-full h-full flex flex-col", className)}>
			<div
				ref={topScrollRef}
				aria-hidden="true"
				className={cn(
					"w-full overflow-x-auto overflow-y-hidden h-4",
					// use a thin scrollbar and match theme colors via existing utilities
					"scrollbar-thin"
				)}
			>
				<div ref={topInnerRef} />
			</div>

			<div
				ref={contentRef}
				className={cn(
					// scroll area fills remaining space; hide only bottom horizontal bar
					"flex-1 min-h-0 overflow-x-auto overflow-y-auto hide-horizontal-scrollbar",
					contentClassName
				)}
			>
				{children}
			</div>
		</div>
	);
}
