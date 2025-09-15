"use client";

import React from "react";

export default function TagsOverviewSkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`w-full lg:max-w-sm h-full ${className}`}>
			<div className="flex h-full w-full gap-4">
				<div className="w-full">
					<div className="w-full flex flex-col justify-between">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col border-r border-border p-4 gap-2">
								<div className="skeleton h-3 w-28" />
								<div className="skeleton h-6 w-32" />
								<div className="skeleton h-3 w-20" />
							</div>
							<div className="flex p-4 flex-col gap-2">
								<div className="skeleton h-3 w-24" />
								<div className="skeleton h-6 w-16" />
								<div className="skeleton h-3 w-20" />
							</div>
						</div>
						<div className="pt-4 mt-3 bg-card rounded-box">
							<div className="w-full relative rounded-box flex p-2 gap-3 h-[200px] min-h-48 space-y-2 pr-2">
								<div className="w-full space-y-2">
									{Array.from({ length: 6 }).map((_, i) => (
										<div
											key={i}
											className="flex items-center p-2 justify-between border-b-1 border-border"
										>
											<div className="flex items-center gap-2">
												<div className="skeleton h-3 w-28" />
												<div className="badge badge-xs skeleton rounded-sm w-14 h-4" />
											</div>
											<div className="flex items-center gap-2 text-xs">
												<div className="skeleton h-3 w-10" />
												<div className="skeleton h-3 w-12" />
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
