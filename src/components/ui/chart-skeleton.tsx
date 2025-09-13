"use client";

import React from "react";

interface ChartSkeletonProps {
	className?: string;
	fill?: boolean;
	variant?: "card" | "inset";
}

export default function ChartSkeleton({
	className = "",
	fill = false,
	variant = "card",
}: ChartSkeletonProps) {
	if (variant === "inset") {
		return (
			<div
				className={`skeleton w-full ${fill ? "h-full" : "h-40"} ${className}`}
			/>
		);
	}
	return (
		<div
			className={`w-full rounded-box border border-border bg-card p-2 ${className} ${
				fill ? "h-full" : ""
			}`}
			style={fill ? { minHeight: 0 } : undefined}
		>
			<div className="flex items-center justify-between mb-3">
				<div className="skeleton h-3 w-24" />
				<div className="skeleton h-3 w-12" />
			</div>
			<div className={`skeleton w-full ${fill ? "h-full" : "h-40"}`} />
		</div>
	);
}
