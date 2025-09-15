"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";

const SessionHistory = dynamic(() => import("./session-history"), {
	ssr: false,
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
