"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";
import PeakFocusWindowChartSkeleton from "./peak-focus-window-chart-skeleton";

const PeakFocusWindowChart = dynamic(
	() => import("./peak-focus-window-chart"),
	{
		ssr: false,
		loading: () => <PeakFocusWindowChartSkeleton />,
	}
);

export default function PeakFocusWindowChartLazy() {
	return (
		<InViewport>
			<PeakFocusWindowChart />
		</InViewport>
	);
}
