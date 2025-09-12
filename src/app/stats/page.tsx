import React from "react";
import Sidebar from "../../components/ui/sidebar";
import StatsHeader from "../../components/ui/stats-header";
import SessionHistoryLazy from "../../components/ui/session-history-lazy";
import HeatMapLazy from "../../components/ui/heat-map-lazy";
import FocusStreak from "../../components/ui/focus-streak";
import TagsOverview from "@/src/components/ui/tags-overview";
// import FocusInsights from "@/src/components/ui/focus-insights";
import PeakFocusWindowChartLazy from "@/src/components/ui/peak-focus-window-chart-lazy";
import LazyStatsOverview from "../../components/ui/stats-overview-lazy";
import PeakFocusWindowChart from "@/src/components/ui/peak-focus-window-chart";
import TauriDemo from "@/src/components/ui/tauri-demo";

export default function StatsPage() {
	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			{/* Main Content */}
			<main className="relative flex flex-col gap-4 flex-1 items-start justify-start">
				<StatsHeader />
				<div className="flex w-full h-full flex-col">
					<div className="w-full h-full flex justify-center items-center overflow-x-auto horizontal-scroll-container">
						<div
							id="stats-content"
							className="flex max-w-[1440px] flex-col gap-4 w-full h-full px-4 lg:px-8 py-4"
						>
							{/* Stats Overview Cards */}
							<div className="card flex-col lg:flex-row gap-4">
								<HeatMapLazy />

								<div className="flex h-full flex-col w-full gap-4">
									<FocusStreak />
									<LazyStatsOverview />
								</div>
							</div>
							<div className="flex lg:flex-row h-full flex-col w-full gap-4">
								<div className="w-full lg:max-w-md">
									<TagsOverview />
								</div>
								<PeakFocusWindowChartLazy />
							</div>
							<TauriDemo />
							{/* Session History */}
							<div className="flex mt-4 gap-4 flex-col lg:flex-row">
								<SessionHistoryLazy />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
