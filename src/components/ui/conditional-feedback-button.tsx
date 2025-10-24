"use client";

import React from "react";
import { usePathname } from "next/navigation";
import FeedbackButton from "./feedback-button";

export default function ConditionalFeedbackButton() {
	const pathname = usePathname();

	// Only show feedback button on main app pages, not on landing or login
	// Exclude: "/" (landing), "/login", and any auth routes
	const shouldShowFeedback =
		pathname === "/home" ||
		pathname === "/stats" ||
		pathname === "/profile" ||
		pathname.startsWith("/auth/");

	if (!shouldShowFeedback) {
		return null;
	}

	return <FeedbackButton />;
}
