"use client";

import React from "react";
import dynamic from "next/dynamic";
import StatsOverviewSkeleton from "./stats-overview-skeleton";

const LazyStatsOverview = dynamic(() => import("./stats-overview"), {
	ssr: false,
	loading: () => <StatsOverviewSkeleton />,
});

export default LazyStatsOverview;
