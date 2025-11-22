import React from "react";
import { Caveat } from "next/font/google";
import LandingTimerDemo from "./landing-timer-demo";
import LandingNoteDemo from "./landing-note-demo";
import LandingHeatmapDemo from "./landing-heatmap-demo";
import { ArrowRight } from "lucide-react";

const caveat = Caveat({
	variable: "--font-caveat",
	subsets: ["latin"],
});

export default function LandingHeroSection() {
	return (
		<section className="flex w-full h-fit overflow-hidden flex-col items-center gap-4 py-10 px-12">
			<div className="flex flex-col gap-7 items-center">
				<h1
					className={`${caveat.className} text-7xl font-semibold text-center`}
				>
					Track deep work hours like it matters
				</h1>
				<p className="font-medium text-lg text-base-content/70 text-center">
					Deepflow helps you enter deep work states effortlessly — so you can
					<br />
					<span className="font-A">
						think better, create more, and feel calm doing it.
					</span>
				</p>
				<div className="flex gap-2">
					<button className="btn btn-primary rounded-full">
						Get started
						<ArrowRight className="size-4" />
					</button>
					<button className="btn btn-secondary btn-soft rounded-full">
						Learn more
					</button>
				</div>
			</div>
			<div className="w-full h-fit min-h-xl max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-500">
				<LandingTimerDemo />
				<LandingNoteDemo />
				<LandingHeatmapDemo />
			</div>
		</section>
	);
}
