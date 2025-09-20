"use client";

import React from "react";

export default function SessionHistorySkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`w-full ${className}`}>
			<div className="skeleton h-96 w-full rounded-box" />
		</div>
	);
}
