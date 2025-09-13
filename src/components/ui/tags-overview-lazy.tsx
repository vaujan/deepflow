"use client";

import React from "react";
import dynamic from "next/dynamic";
import InViewport from "./in-viewport";
import TagsOverviewSkeleton from "./tags-overview-skeleton";

const TagsOverview = dynamic(() => import("./tags-overview"), {
	ssr: false,
	loading: () => <TagsOverviewSkeleton />,
});

export default function TagsOverviewLazy() {
	return <TagsOverview />;
}
