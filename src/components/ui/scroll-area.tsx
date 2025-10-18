"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/src/lib/utils";

const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
	return (
		<ScrollAreaPrimitive.Root
			ref={ref}
			data-slot="scroll-area"
			className={cn(
				"group relative h-full overflow-hidden pr-1 pb-1",
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				data-slot="scroll-area-viewport"
				className="focus-visible:ring-ring/50 h-full w-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollBar orientation="horizontal" />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			ref={ref}
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				"flex touch-none select-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100",
				orientation === "vertical" &&
					"h-full w-2.5 border-l border-l-transparent p-[1px]",
				orientation === "horizontal" &&
					"h-2.5 flex-col border-t border-t-transparent p-[1px]",
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="relative flex-1 rounded-full bg-base-content/30 hover:bg-base-content/50"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
