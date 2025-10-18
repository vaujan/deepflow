export {}; // ensure this file is a module

declare global {
	interface Window {
		electron?: {
			openExternal: (url: string) => Promise<boolean>;
			window: {
				minimize: () => Promise<boolean>;
				toggleMaximize: () => Promise<boolean>;
				isMaximized: () => Promise<boolean>;
				close: () => Promise<boolean>;
				onMaximizeChanged: (
					handler: (isMaximized: boolean) => void
				) => () => void;
				zoomIn: () => Promise<number>;
				zoomOut: () => Promise<number>;
				zoomReset: () => Promise<number>;
				getZoom: () => Promise<number>;
			};
		};
	}
}
