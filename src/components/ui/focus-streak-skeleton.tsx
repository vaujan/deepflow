"use client";

import React from "react";

export default function FocusStreakSkeleton({
	className = "",
}: {
	className?: string;
}) {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	return (
		<div className={`w-full ${className}`}>
			<div className="flex w-full gap-4">
				<div className="w-full p-2 border card border-border bg-card">
					<div className="flex justify-between h-full">
						<div className="flex flex-col w-full gap-4">
							{/* KPIs */}
							<div className="flex gap-4">
								<div className="flex items-center w-full gap-4 p-4 border-r-1 border-border h-fit">
									<div className="flex flex-col gap-2">
										<div className="skeleton h-3 w-24" />
										<div className="skeleton h-6 w-20" />
										<div className="skeleton h-3 w-28" />
									</div>
									<div className="skeleton size-8 rounded-sm" />
								</div>
								<div className="flex items-center w-full gap-4 p-4 h-fit">
									<div className="flex flex-col gap-2">
										<div className="skeleton h-3 w-24" />
										<div className="skeleton h-6 w-20" />
										<div className="skeleton h-3 w-28" />
									</div>
									<div className="skeleton size-8 rounded-sm" />
								</div>
							</div>
							{/* Weekly grid */}
							<div className="relative flex items-center justify-center gap-3 p-4 overflow-x-auto border bg-base-100 border-border rounded-box">
								{days.map((d, i) => (
									<div
										key={d}
										className="flex flex-col items-center gap-1 min-w-10"
									>
										<div className="size-7 rounded-full grid place-items-center border border-border skeleton" />
										<div className="skeleton h-3 w-8" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
