"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";

const SessionHistory = dynamic(() => import("./session-history"), {
	ssr: false,
	loading: () => (
		<div className="w-full min-h-56 rounded-box border border-border bg-card animate-pulse" />
	),
});

export default function SessionHistoryLazy() {
	return (
		<InViewport>
			<SessionHistory />
		</InViewport>
	);
}
