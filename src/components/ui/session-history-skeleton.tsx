"use client";

import React from "react";

export default function SessionHistorySkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`w-full ${className}`}>
			<div className="rounded-box border border-border bg-card p-3">
				{/* Top controls */}
				<div className="flex flex-wrap gap-2 mb-3">
					<div className="skeleton h-9 w-40" />
					<div className="skeleton h-9 w-28" />
					<div className="skeleton h-9 w-28" />
					<div className="skeleton h-9 w-32" />
				</div>
				{/* Table header */}
				<div className="grid grid-cols-6 gap-2 py-2 border-b border-border">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="skeleton h-4 w-full" />
					))}
				</div>
				{/* Rows */}
				<div className="space-y-2 mt-2">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="grid grid-cols-6 gap-2 py-2">
							{Array.from({ length: 6 }).map((__, j) => (
								<div key={j} className="skeleton h-5 w-full" />
							))}
						</div>
					))}
				</div>
				{/* Pagination */}
				<div className="flex justify-between items-center pt-3 border-t border-border mt-3">
					<div className="skeleton h-8 w-24" />
					<div className="flex gap-2">
						<div className="skeleton h-8 w-8 rounded" />
						<div className="skeleton h-8 w-8 rounded" />
					</div>
				</div>
			</div>
		</div>
	);
}
