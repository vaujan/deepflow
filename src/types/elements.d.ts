// Provide JSX typing for the Cally web components so TSX understands them
import React from "react";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"calendar-date": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & {
				value?: string;
				months?: number;
			};
			"calendar-range": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & {
				months?: number;
				value?: string;
			};
			"calendar-month": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & {
				offset?: number;
			};
		}
	}
}

declare module "react" {
	// Also augment React.JSX namespace to satisfy React 19 types
	namespace JSX {
		interface IntrinsicElements {
			"calendar-date": any;
			"calendar-range": any;
			"calendar-month": any;
		}
	}
}

// Allow importing the module without type definitions
declare module "cally";

export {};
