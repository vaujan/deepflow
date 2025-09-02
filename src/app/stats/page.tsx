"use client";

import React from "react";
import Sidebar from "../../components/ui/sidebar";
import Header from "../../components/ui/header";
import StatsOverview from "../../components/ui/stats-overview";
import SessionHistory from "../../components/ui/session-history";
import ProductivityChart from "../../components/ui/productivity-chart";
import FocusInsights from "../../components/ui/focus-insights";

export default function StatsPage() {
	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			{/* Main Content */}
			<main className="w-full relative flex flex-col gap-4 flex-1 items-start justify-start">
				<Header />
				<div className="flex w-full h-full flex-col">
					<div className="w-full h-full overflow-x-auto horizontal-scroll-container">
						<div className="flex flex-col gap-8 w-full h-full px-4 lg:px-8 py-4">
							{/* Page Header */}
							<div className="flex flex-col gap-2">
								<h1 className="text-3xl font-bold text-base-content">
									Deep Work Analytics
								</h1>
								<p className="text-base-content/70">
									Track your productivity and focus patterns
								</p>
							</div>

							{/* Stats Overview Cards */}
							<StatsOverview />

							{/* Charts and Insights Grid */}
							<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
								{/* Productivity Chart */}
								<div className="card bg-base-100 p-6">
									<div className="card-body p-0">
										<h2 className="card-title text-lg mb-4">
											Productivity Trends
										</h2>
										<ProductivityChart />
									</div>
								</div>

								{/* Focus Insights */}
								<div className="card bg-base-100 p-6">
									<div className="card-body p-0">
										<h2 className="card-title text-lg mb-4">Focus Insights</h2>
										<FocusInsights />
									</div>
								</div>
							</div>

							{/* Session History */}
							<div className="card bg-base-100 p-6">
								<div className="card-body p-0">
									<h2 className="card-title text-lg mb-4">Recent Sessions</h2>
									<SessionHistory />
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
