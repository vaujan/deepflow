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
			};
		};
	}
}
