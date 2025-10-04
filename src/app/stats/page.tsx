import React from "react";
import StatsHeader from "../../components/ui/stats-header";
import SessionHistoryLazy from "../../components/ui/session-history-lazy";
import HeatMapLazy from "../../components/ui/heat-map-lazy";
import FocusStreakLazy from "../../components/ui/focus-streak-lazy";
import TagsOverviewLazy from "@/src/components/ui/tags-overview-lazy";
import PeakFocusWindowChartLazy from "@/src/components/ui/peak-focus-window-chart-lazy";
import LazyStatsOverview from "../../components/ui/stats-overview-lazy";

export default function StatsPage() {
	return (
		<div className="flex flex-col min-h-screen bg-base-300 lg:flex-row">
			{/* <Sidebar /> */}
			{/* Main Content */}
			<main className="relative flex flex-col items-start justify-start flex-1 gap-4">
				<StatsHeader />
				<div className="flex flex-col w-full h-full">
					<div className="flex items-center justify-center w-full h-full overflow-x-auto horizontal-scroll-container">
						<div
							id="stats-content"
							className="flex max-w-[1440px] flex-col gap-4 w-full h-full px-4 lg:px-8 py-4"
						>
							{/* Stats Overview Cards */}
							<div className="flex-col gap-4 card lg:flex-row">
								<div className="w-full">
									<HeatMapLazy />
								</div>
								<div className="flex flex-col w-full h-full gap-4">
									<FocusStreakLazy />
									<PeakFocusWindowChartLazy />
								</div>
							</div>
							<div className="flex flex-col w-full h-full gap-4 lg:flex-row">
								<TagsOverviewLazy />
								<LazyStatsOverview />
							</div>
							{/* Session History */}
							<SessionHistoryLazy />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
