"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";

const PeakFocusWindowChart = dynamic(
	() => import("./peak-focus-window-chart"),
	{
		ssr: false,
		loading: () => (
			<div className="card border border-border w-full bg-card p-2 min-h-64 animate-pulse" />
		),
	}
);

export default function PeakFocusWindowChartLazy() {
	return (
		<InViewport>
			<PeakFocusWindowChart />
		</InViewport>
	);
}
