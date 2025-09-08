"use client";

import React from "react";
import Sidebar from "../../components/ui/sidebar";
import Header from "../../components/ui/header";
import StatsOverview from "../../components/ui/stats-overview";
import SessionHistory from "../../components/ui/session-history";
import HeatMap from "../../components/ui/heat-map";
import FocusStreak from "../../components/ui/focus-streak";
import TagsOverview from "@/src/components/ui/tags-overview";
import FocusInsights from "@/src/components/ui/focus-insights";
import PeakFocusWindowChart from "@/src/components/ui/peak-focus-window-chart";

export default function StatsPage() {
	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			{/* Main Content */}
			<main className="w-full relative flex flex-col gap-4 flex-1 items-start justify-start">
				<Header />
				<div className="flex w-full h-full flex-col">
					<div className="w-full h-full overflow-x-auto horizontal-scroll-container">
						<div className="flex flex-col gap-4 w-full h-full px-4 lg:px-8 py-4">
							{/* Stats Overview Cards */}
							<div className="card lg:flex-row gap-4">
								<HeatMap />

								<div className="flex lg:max-w-3xl h-full flex-col w-full gap-4">
									<FocusStreak />
									<StatsOverview />
								</div>
							</div>

							<div className="flex lg:flex-row h-full flex-col w-full gap-4">
								<PeakFocusWindowChart />
								<TagsOverview />
							</div>
							{/* <FocusInsights /> */}

							{/* Session History */}
							<div className="flex gap-4 flex-col lg:flex-row">
								<SessionHistory />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
