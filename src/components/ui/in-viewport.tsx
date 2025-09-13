"use client";

import React, { useEffect, useRef, useState } from "react";

interface InViewportProps {
	children: React.ReactNode;
	rootMargin?: string;
	onEnterOnce?: boolean;
	fallback?: React.ReactNode;
}

export default function InViewport({
	children,
	rootMargin = "200px",
	onEnterOnce = true,
	fallback,
}: InViewportProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		let didUnmount = false;
		const observer = new IntersectionObserver(
			(entries) => {
				if (didUnmount) return;
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setIsVisible(true);
						if (onEnterOnce) observer.disconnect();
						break;
					}
				}
			},
			{ root: null, rootMargin, threshold: 0.01 }
		);
		observer.observe(ref.current);
		return () => {
			didUnmount = true;
			observer.disconnect();
		};
	}, [rootMargin, onEnterOnce]);

	return <div ref={ref}>{isVisible ? children : fallback ?? null}</div>;
}
