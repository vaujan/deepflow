"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Minus,
	Square,
	Copy as Restore,
	X,
	ZoomIn,
	ZoomOut,
	RotateCcw,
} from "lucide-react";
import clsx from "clsx";
import Profile from "./profile";

export default function () {
	const isElectron = typeof window !== "undefined" && !!window.electron;
	const [isMax, setIsMax] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);

	useEffect(() => {
		if (!isElectron) return;
		let unsubscribe: (() => void) | undefined;
		window.electron?.window
			.isMaximized()
			.then(setIsMax)
			.catch(() => {});
		unsubscribe = window.electron?.window.onMaximizeChanged((m) => setIsMax(m));
		return () => {
			try {
				unsubscribe?.();
			} catch {}
		};
	}, [isElectron]);

	useEffect(() => {
		if (!isElectron) return;
		window.electron?.window
			.getZoom()
			.then(setZoomLevel)
			.catch(() => {});
	}, [isElectron]);

	const title = useMemo(() => "Hello world", []);

	if (!isElectron) return null;

	return (
		<div
			className={clsx(
				"electron-drag flex items-center justify-between gap-2",
				"h-9 select-none px-2",
				"bg-base-300 text-[var(--color-base-content)]"
			)}
			style={{ WebkitAppRegion: "drag" as any }}
		>
			<div className="electron-no-drag flex items-center gap-1">
				<span className="text-xs text-[var(--color-base-content)]/70 px-2">
					{Math.round(zoomLevel * 100)}%
				</span>
				<button
					aria-label="Zoom Out"
					title="Zoom Out (Ctrl+-)"
					className={buttonCls}
					onClick={async () => {
						try {
							const newZoom = await window.electron?.window.zoomOut();
							setZoomLevel(newZoom);
						} catch {}
					}}
				>
					<ZoomOut size={14} />
				</button>
				<button
					aria-label="Reset Zoom"
					title="Reset Zoom (Ctrl+0)"
					className={buttonCls}
					onClick={async () => {
						try {
							const newZoom = await window.electron?.window.zoomReset();
							setZoomLevel(newZoom);
						} catch {}
					}}
				>
					<RotateCcw size={14} />
				</button>
				<button
					aria-label="Zoom In"
					title="Zoom In (Ctrl+=)"
					className={buttonCls}
					onClick={async () => {
						try {
							const newZoom = await window.electron?.window.zoomIn();
							setZoomLevel(newZoom);
						} catch {}
					}}
				>
					<ZoomIn size={14} />
				</button>
			</div>
			<div className="electron-no-drag flex items-center">
				<button
					aria-label="Minimize"
					title="Minimize"
					className={buttonCls}
					onClick={() => window.electron?.window.minimize()}
				>
					<Minus size={14} />
				</button>
				<button
					aria-label={isMax ? "Restore" : "Maximize"}
					title={isMax ? "Restore" : "Maximize"}
					className={buttonCls}
					onClick={async () =>
						setIsMax(
							await (window.electron?.window.toggleMaximize() as Promise<boolean>)
						)
					}
				>
					{isMax ? <Restore size={13} /> : <Square size={12} />}
				</button>
				<button
					aria-label="Close"
					title="Close"
					className={clsx(buttonCls, "hover:bg-red-500/90 hover:text-white")}
					onClick={() => window.electron?.window.close()}
				>
					<X size={12} />
				</button>
			</div>
		</div>
	);
}

const buttonCls = clsx(
	"btn btn-sm btn-ghost",
	"text-[var(--color-base-content)]/80 hover:bg-[var(--color-border)]",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
	"transition-colors"
);
