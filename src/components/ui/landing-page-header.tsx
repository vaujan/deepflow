import React from "react";
import Profile from "./profile";

export default function LandingPageHeader() {
	return (
		<div className="px-4 py-2 flex bg-base-100/10 border-b border-border w-full justify-between">
			<div className="bg-base-300 px-4 font-mono text-base-content/50 py-4 border-border border rounded-lg">
				noctuna
			</div>
			<Profile />
		</div>
	);
}
