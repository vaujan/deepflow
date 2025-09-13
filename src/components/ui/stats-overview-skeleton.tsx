"use client";

import React from "react";

export default function StatsOverviewSkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`w-full h-full ${className}`}>
			<div className="flex w-full gap-4">
				<div className="card border border-border w-full bg-card p-2">
					<div className="flex flex-col w-full gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col border-r border-border p-4 gap-2">
								<div className="skeleton h-3 w-28" />
								<div className="skeleton h-6 w-40" />
								<div className="skeleton h-3 w-24" />
							</div>
							<div className="flex p-4 flex-col gap-2">
								<div className="skeleton h-3 w-28" />
								<div className="skeleton h-6 w-24" />
								<div className="skeleton h-3 w-24" />
							</div>
						</div>
						<div className="w-full min-h-48">
							<div className="skeleton w-full h-40 rounded-box" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
