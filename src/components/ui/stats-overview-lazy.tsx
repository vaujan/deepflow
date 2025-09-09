"use client";

import React from "react";
import dynamic from "next/dynamic";

const LazyStatsOverview = dynamic(() => import("./stats-overview"), {
	ssr: false,
	loading: () => (
		<div className="card border border-border w-full bg-card p-2 min-h-48 flex items-center justify-center">
			<div className="text-sm text-base-content/60">Loading overview…</div>
		</div>
	),
});

export default LazyStatsOverview;
