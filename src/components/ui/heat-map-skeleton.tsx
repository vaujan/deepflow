"use client";

import React from "react";

export default function HeatMapSkeleton({
	className = "",
}: {
	className?: string;
}) {
	// Build 42 cells (6 weeks x 7 days)
	const calendarCells = Array.from({ length: 42 }, (_, i) => i);
	// Yearly compact grid: 53 weeks x 7 days
	const weeks = Array.from({ length: 53 }, (_, i) => i);
	const daysInWeek = Array.from({ length: 7 }, (_, i) => i);

	return (
		<div
			className={`space-y-4 bg-base-200 rounded-box p-6 mt-2 w-full ${className}`}
		>
			{/* Header with month navigation */}
			<div className="flex items-center justify-between">
				<div className="flex gap-4 items-center">
					<div className="skeleton h-5 w-40" />
					<div className="skeleton h-5 w-12" />
				</div>
				<div className="flex gap-2">
					<div className="skeleton h-8 w-8 rounded-full" />
					<div className="skeleton h-8 w-8 rounded-full" />
				</div>
			</div>

			{/* Day labels */}
			<div className="grid grid-cols-7 gap-1 text-xs text-center">
				{Array.from({ length: 7 }).map((_, idx) => (
					<div key={idx} className="py-1 rounded-sm">
						<div className="skeleton h-3 w-10 mx-auto" />
					</div>
				))}
			</div>

			{/* Calendar grid 6x7 */}
			<div className="grid grid-cols-7 gap-1">
				{calendarCells.map((i) => (
					<div key={i} className="min-h-12 w-full h-full rounded-sm">
						<div className="skeleton w-full h-12 rounded-sm" />
					</div>
				))}
			</div>

			{/* Yearly GitHub-style Heat Map (compact) */}
			<div className="overflow-x-auto py-8 overflow-y-hidden lg:py-0 lg:overflow-visible lg:flex lg:justify-center border-1 p-2 border-border rounded-box lg:p-0 lg:border-0">
				<div className="flex w-full gap-1">
					{weeks.map((w) => (
						<div key={w} className="flex flex-col gap-1">
							{daysInWeek.map((d) => (
								<div key={d} className="w-2.5 h-2.5 rounded-xs skeleton" />
							))}
						</div>
					))}
				</div>
			</div>

			{/* Legend */}
			<div className="flex items-center justify-center gap-3 text-xs">
				<div className="skeleton h-3 w-10" />
				<div className="flex gap-0.5 items-center">
					{[0, 1, 2, 3, 4].map((level) => (
						<div key={level} className="w-4 h-2 rounded-xs skeleton" />
					))}
				</div>
				<div className="skeleton h-3 w-10" />
			</div>
		</div>
	);
}
