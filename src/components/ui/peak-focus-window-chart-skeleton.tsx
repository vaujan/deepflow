"use client";

import React from "react";

export default function PeakFocusWindowChartSkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`w-full ${className}`}>
			<div className="skeleton bg-base-200/50 h-80 w-full rounded-box" />
		</div>
	);
}
