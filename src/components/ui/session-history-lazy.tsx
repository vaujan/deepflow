"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";
import ChartSkeleton from "./chart-skeleton";

const SessionHistory = dynamic(() => import("./session-history"), {
	ssr: false,
	loading: () => <ChartSkeleton className="min-h-56" />,
});

export default function SessionHistoryLazy() {
	return (
		<>
			<InViewport>
				<SessionHistory />
			</InViewport>
		</>
	);
}
