"use client";

import React from "react";

export default function PeakFocusWindowChartSkeleton({
	className = "",
}: {
	className?: string;
}) {
	const hourLabels = Array.from({ length: 24 }, (_, i) => i);
	const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div className={`card bg-base-200 p-2 ${className}`}>
			<div className="flex flex-col w-full gap-4">
				{/* Header KPIs */}
				<div className="grid grid-cols-2 gap-4">
					{/* Left KPI */}
					<div className="flex flex-col border-r border-border p-4 gap-2">
						<div className="skeleton h-3 w-28" />
						<div className="skeleton h-6 w-40" />
						<div className="skeleton h-2.5 w-24" />
					</div>

					{/* Right KPI */}
					<div className="flex p-4 flex-col gap-2">
						<div className="skeleton h-3 w-28" />
						<div className="skeleton h-6 w-24" />
						<div className="skeleton h-2.5 w-28" />
					</div>
				</div>

				{/* Heatmap area */}
				<div className="w-full">
					<div className="bg-base-100 border border-border rounded-box p-3">
						<div className="flex flex-col gap-2">
							{/* X-axis hour labels (every 3 hours) */}
							<div className="flex items-center gap-2">
								<div className="w-8" />
								<div
									className="grid gap-[2px] flex-1"
									style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
								>
									{hourLabels.map((h) => {
										const show = h % 3 === 0;
										return (
											<div
												key={h}
												className="h-3 flex items-center justify-center"
											>
												{show ? <div className="skeleton h-2 w-10" /> : null}
											</div>
										);
									})}
								</div>
							</div>

							{/* 7 rows (Mon..Sun) × 24 cols */}
							{weekdays.map((_, rIdx) => (
								<div key={rIdx} className="flex items-center gap-2">
									{/* Weekday label */}
									<div className="w-8 pr-1 flex justify-end">
										<div className="skeleton h-3 w-6" />
									</div>

									{/* 24 heat cells */}
									<div
										className="grid flex-1 gap-[2px]"
										style={{
											gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
										}}
									>
										{hourLabels.map((hourIdx) => (
											<div
												key={hourIdx}
												className="h-4 rounded-[2px] skeleton"
											/>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
