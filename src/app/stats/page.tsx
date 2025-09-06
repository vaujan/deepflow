"use client";

import React from "react";
import Sidebar from "../../components/ui/sidebar";
import Header from "../../components/ui/header";
import StatsOverview from "../../components/ui/stats-overview";
import SessionHistory from "../../components/ui/session-history";
import ProductivityChart from "../../components/ui/productivity-chart";
import FocusInsights from "../../components/ui/focus-insights";
import HeatMap from "../../components/ui/heat-map";
import StreakCards from "../../components/ui/streak-cards";
import TagFocusChart from "../../components/ui/tag-focus-chart";
import PeakFocusWindowChart from "../../components/ui/peak-focus-window-chart";

export default function StatsPage() {
	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			{/* Main Content */}
			<main className="w-full relative flex flex-col gap-4 flex-1 items-start justify-start">
				<Header />
				<div className="flex w-full h-full flex-col">
					<div className="w-full h-full overflow-x-auto horizontal-scroll-container">
						<div className="flex flex-col gap-12 w-full h-full px-4 lg:px-8 py-4">
							{/* Stats Overview Cards */}
							<div className="card lg:flex-row gap-4">
								<HeatMap />
								<StatsOverview />
							</div>

							{/* Streaks */}
							<div className="grid grid-cols-1 gap-4">
								<StreakCards />
							</div>

							{/* Charts and Insights Grid */}
							<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
								<TagFocusChart />
								<PeakFocusWindowChart />
							</div>

							{/* Session History */}
							<div className="">
								<SessionHistory />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
