"use client";

import React from "react";

export default function FocusStreakSkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`w-full ${className}`}>
			<div className="skeleton bg-base-200/50 h-64 w-full rounded-box" />
		</div>
	);
}
