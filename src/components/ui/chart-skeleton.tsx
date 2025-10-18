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
	return (
		<div
			className={`skeleton w-full ${
				fill ? "h-full" : "h-40"
			} rounded-box ${className}`}
		/>
	);
}
