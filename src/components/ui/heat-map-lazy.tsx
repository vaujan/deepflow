import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";

const HeatMap = dynamic(() => import("./heat-map"), {
	ssr: true,
	loading: () => (
		<div className="w-full min-h-48 rounded-box border border-border bg-card animate-pulse" />
	),
});

export default function HeatMapLazy() {
	return (
		<InViewport>
			<HeatMap />
		</InViewport>
	);
}
