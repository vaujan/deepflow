// "use client";

import React from "react";
import dynamic from "next/dynamic";

const PeakFocusWindowChart = dynamic(
	() => import("./peak-focus-window-chart"),
	{
		ssr: true,
		loading: () => (
			<div className="card border border-border w-full bg-card p-2 min-h-64 animate-pulse" />
		),
	}
);

export default function PeakFocusWindowChartLazy() {
	return (
		<>
			<PeakFocusWindowChart />
		</>
	);
}
