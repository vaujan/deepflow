"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";
import HeatMapSkeleton from "./heat-map-skeleton";

const HeatMap = dynamic(() => import("./heat-map"), {
	ssr: false,
	loading: () => <HeatMapSkeleton />,
});

export default function HeatMapLazy() {
	return (
		<InViewport fallback={<HeatMapSkeleton />}>
			<HeatMap />
		</InViewport>
	);
}
