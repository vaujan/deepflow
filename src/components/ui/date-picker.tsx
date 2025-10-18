"use client";

import React, { useEffect, useRef } from "react";

type DatePickerProps = {
	value?: string; // YYYY-MM-DD
	onChange: (value: string) => void;
	className?: string;
};

// Lightweight React wrapper around Cally's <calendar-date>
export default function DatePicker({
	value,
	onChange,
	className,
}: DatePickerProps) {
	const ref = useRef<HTMLElement | null>(null);

	// Load the web components on the client only
	useEffect(() => {
		// Prefer installed package, but fall back to CDN for safety without types
		if (typeof window !== "undefined") {
			if (!customElements.get("calendar-date")) {
				const script = document.createElement("script");
				script.type = "module";
				script.src = "https://unpkg.com/cally";
				document.head.appendChild(script);
			}
		}
		return () => {};
	}, []);

	// Keep the element value in sync with props
	useEffect(() => {
		const el = ref.current as unknown as {
			value?: string;
			setAttribute: (n: string, v: string) => void;
		} | null;
		if (!el) return;
		if (value) {
			try {
				// Prefer property if supported; fall back to attribute
				(el as any).value = value;
				el.setAttribute("value", value);
			} catch {}
		} else {
			try {
				(el as any).value = "";
				el.setAttribute("value", "");
			} catch {}
		}
	}, [value]);

	useEffect(() => {
		const el = ref.current as unknown as HTMLElement | null;
		if (!el) return;
		const handler = (e: Event) => {
			const target = e.target as any;
			const next = (target?.value ?? "").toString();
			if (next) onChange(next);
		};
		el.addEventListener("change", handler as EventListener);
		return () => el.removeEventListener("change", handler as EventListener);
	}, [onChange]);

	// Use createElement to avoid strict JSX typing of custom elements
	// DaisyUI-styled navigation buttons using slots recognized by Cally
	const previousButton = React.createElement(
		"button",
		{
			type: "button",
			slot: "previous",
			className: "btn btn-ghost btn-square btn-sm size-8",
			"aria-label": "Previous month",
			title: "Previous month",
		} as any,
		React.createElement(
			"svg",
			{
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24",
				width: 16,
				height: 16,
				"aria-hidden": "true",
			} as any,
			React.createElement("path", {
				d: "M15.75 19.5 8.25 12l7.5-7.5",
				stroke: "currentColor",
				strokeWidth: 2,
				fill: "none",
				strokeLinecap: "round",
				strokeLinejoin: "round",
			} as any)
		)
	);

	const nextButton = React.createElement(
		"button",
		{
			type: "button",
			slot: "next",
			className: "btn btn-ghost btn-square btn-sm size-8",
			"aria-label": "Next month",
			title: "Next month",
		} as any,
		React.createElement(
			"svg",
			{
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24",
				width: 16,
				height: 16,
				"aria-hidden": "true",
			} as any,
			React.createElement("path", {
				d: "m8.25 4.5 7.5 7.5-7.5 7.5",
				stroke: "currentColor",
				strokeWidth: 2,
				fill: "none",
				strokeLinecap: "round",
				strokeLinejoin: "round",
			} as any)
		)
	);

	return React.createElement(
		"calendar-date",
		{ ref: ref as any, className: className ? className : "cally" },
		previousButton,
		nextButton,
		React.createElement("calendar-month", null)
	);
}
