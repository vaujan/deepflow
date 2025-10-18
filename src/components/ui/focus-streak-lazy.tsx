"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";
import FocusStreakSkeleton from "./focus-streak-skeleton";

const FocusStreak = dynamic(() => import("./focus-streak"), {
	ssr: false,
	loading: () => <FocusStreakSkeleton />,
});

export default function FocusStreakLazy() {
	return (
		<InViewport fallback={<FocusStreakSkeleton />}>
			<FocusStreak />
		</InViewport>
	);
}
