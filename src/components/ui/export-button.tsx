"use client";

import { Download } from "lucide-react";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

interface ExportButtonProps {
	className?: string;
	exportElementId?: string;
}

export default function ExportButton({
	className = "",
	exportElementId = "stats-content",
}: ExportButtonProps) {
	const [isExporting, setIsExporting] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleExport = async () => {
		if (isExporting) return;

		setIsExporting(true);

		try {
			const element = document.getElementById(exportElementId);
			if (!element) {
				console.error("Export element not found");
				return;
			}

			// Configure html2canvas options for better quality
			const canvas = await html2canvas(element, {
				backgroundColor: "#1a1a1a", // Dark background to match theme
				scale: 2, // Higher resolution for crisp images
				useCORS: true,
				allowTaint: true,
				scrollX: 0,
				scrollY: 0,
				width: element.scrollWidth,
				height: element.scrollHeight,
				windowWidth: element.scrollWidth,
				windowHeight: element.scrollHeight,
				ignoreElements: (element) => {
					// Ignore the export button itself to avoid capturing it
					return element === buttonRef.current;
				},
			});

			// Prefer blob/object URL for reliability and memory efficiency
			const fileName = `deepflow-stats-${
				new Date().toISOString().split("T")[0]
			}.png`;
			const blob: Blob | null = await new Promise((resolve) =>
				canvas.toBlob((b) => resolve(b), "image/png", 1.0)
			);

			if (blob) {
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.download = fileName;
				link.href = url;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
			} else {
				// Fallback to data URL if toBlob is not supported
				const link = document.createElement("a");
				link.download = fileName;
				link.href = canvas.toDataURL("image/png", 1.0);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		} catch (error) {
			console.error("Export failed:", error);
			// You could add a toast notification here
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<button
			ref={buttonRef}
			onClick={handleExport}
			disabled={isExporting}
			data-html2canvas-ignore="true"
			aria-busy={isExporting}
			className={`btn btn-sm btn-ghost gap-2 ${className} ${
				isExporting ? "loading" : ""
			}`}
			title="Export stats as image"
		>
			{!isExporting && <Download className="size-4" />}
			{isExporting ? "Exporting..." : "Export"}
		</button>
	);
}
