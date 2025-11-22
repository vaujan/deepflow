"use client";

import React from "react";
import { Caveat } from "next/font/google";
import LandingPageHeader from "../components/ui/landing-page-header";
import LandingHeroSection from "../components/ui/landing-hero-section";
import LandingFeatureSection from "../components/ui/landing-feature.section";

import LandingFooter from "../components/ui/landing-footer";

const caveat = Caveat({
	variable: "--font-caveat",
	subsets: ["latin"],
});

export default function LandingPage() {
	return (
		<div
			className={`${caveat.variable} min-h-screen flex flex-col items-center bg-base-300`}
		>
			<LandingPageHeader />
			<LandingHeroSection />
			<LandingFeatureSection />
			<LandingFooter />
		</div>
	);
}
