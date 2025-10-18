"use client";

import React from "react";

export default function TagsOverviewSkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`w-full lg:max-w-sm h-full ${className}`}>
			<div className="skeleton bg-base-200/50 h-80 w-full rounded-box" />
		</div>
	);
}
