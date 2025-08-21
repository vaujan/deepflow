import { useState, useEffect } from "react";

export interface DeepWorkTip {
	title: string;
	description: string;
}

export const deepWorkTips: DeepWorkTip[] = [
	{
		title: "Time Blocking",
		description:
			"Schedule dedicated 90-minute blocks for deep work. Protect these times from meetings and interruptions.",
	},
	{
		title: "Environment Setup",
		description:
			"Create a distraction-free workspace. Remove notifications, close unnecessary tabs, and use noise-canceling if needed.",
	},
	{
		title: "The 20-Minute Rule",
		description:
			"If you're struggling to focus, commit to just 20 minutes. Often, momentum builds and you'll want to continue.",
	},
	{
		title: "Energy Management",
		description:
			"Schedule deep work during your peak energy hours. Most people are most focused in the morning.",
	},
	{
		title: "Single Task Focus",
		description:
			"Work on one task at a time. Multitasking reduces quality and increases time to completion.",
	},
	{
		title: "Break Strategy",
		description:
			"Take 5-10 minute breaks every 90 minutes. Use this time to stretch, walk, or do something completely different.",
	},
	{
		title: "Goal Clarity",
		description:
			"Define what 'done' looks like before starting. Clear objectives help maintain focus and motivation.",
	},
	{
		title: "Digital Minimalism",
		description:
			"Use apps and tools that support deep work, not distract from it. Consider website blockers during focus sessions.",
	},
];

// Custom hook for tips functionality
export const useTips = (
	tips: DeepWorkTip[],
	autoRotateInterval: number = 60000
) => {
	const [currentTipIndex, setCurrentTipIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [showTipsCard, setShowTipsCard] = useState(true);

	const nextTip = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentTipIndex((prev) => (prev + 1) % tips.length);
		setTimeout(() => setIsAnimating(false), 150);
	};

	const previousTip = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
		setTimeout(() => setIsAnimating(false), 150);
	};

	const hideTipsCard = () => {
		setShowTipsCard(false);
	};

	const showTipsCardHandler = () => {
		setShowTipsCard(true);
	};

	// Auto-rotate tips every minute
	useEffect(() => {
		if (!showTipsCard) return; // Don't auto-rotate if tips card is hidden

		const interval = setInterval(() => {
			nextTip();
		}, autoRotateInterval);

		return () => clearInterval(interval);
	}, [showTipsCard, autoRotateInterval]);

	return {
		currentTipIndex,
		isAnimating,
		showTipsCard,
		currentTip: tips[currentTipIndex],
		nextTip,
		previousTip,
		hideTipsCard,
		showTipsCardHandler,
		totalTips: tips.length,
	};
};
