"use client";

import React from "react";

interface WidgetFrameProps {
	title: string;
	icon?: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
}

export default function WidgetFrame({
	title,
	icon,
	actions,
	className = "",
	children,
}: WidgetFrameProps) {
	return (
		<section
			className={`card border border-border bg-card rounded-box shadow-xs w-full min-w-[280px] ${className}`}
			aria-label={`${title} widget`}
		>
			<header className="flex items-center justify-between px-3 py-2 lg:px-4 lg:py-3 border-b border-border">
				<div className="flex items-center gap-2">
					{icon}
					<h3 className="text-sm font-medium">{title}</h3>
				</div>
				{actions ? (
					<div className="flex items-center gap-2">{actions}</div>
				) : null}
			</header>
			<div className="p-3 lg:p-4">{children}</div>
		</section>
	);
}
