"use client";

import React from "react";
import Header from "../components/ui/stats-header";
import { Instrument_Serif, Caveat } from "next/font/google";
import Image from "next/image";
import LandingTimerDemo from "../components/ui/landing-timer-demo";
import LandingNoteDemo from "../components/ui/landing-note-demo";
import LandingHeatmapDemo from "../components/ui/landing-heatmap-demo";

const caveat = Caveat({
	variable: "--font-caveat",
	subsets: ["latin"],
});

export default function LandingPage() {
	return (
		<div
			className={`${caveat.variable} h-screen overflow-y-scroll flex flex-col items-center bg-base-300`}
		>
			<section className="flex w-full h-full flex-col items-center gap-4 py-10 px-12">
				<div className="flex flex-col gap-2 items-center">
					<h1
						className={`${caveat.className} text-7xl font-semibold text-center`}
					>
						Reclaim your focus.
					</h1>
					<p className="font-medium text-lg text-base-content/70 text-center">
						Deepflow helps you enter deep work states effortlessly — so you can
						<br />
						<span className="font-A">
							think better, create more, and feel calm doing it.
						</span>
					</p>
				</div>
				<div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-500">
					<LandingTimerDemo />
					<LandingNoteDemo />
					<LandingHeatmapDemo />
				</div>
			</section>
		</div>
	);
}
