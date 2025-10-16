import { NextRequest } from "next/server";
import { logger } from "./logger";

/**
 * CSRF protection utility
 * Validates that requests come from the same origin
 */

export function validateCSRF(request: NextRequest): boolean {
	try {
		const origin = request.headers.get("origin");
		const referer = request.headers.get("referer");
		const host = request.headers.get("host");

		// For API routes, we need to check the origin
		if (origin) {
			const expectedOrigin =
				process.env.NODE_ENV === "production"
					? `https://${host}`
					: `http://${host}`;

			if (origin !== expectedOrigin) {
				logger.warn("CSRF validation failed - invalid origin", {
					origin,
					expectedOrigin,
					path: request.nextUrl.pathname,
				});
				return false;
			}
		}

		// For form submissions, check referer
		if (referer) {
			const refererUrl = new URL(referer);
			const expectedHost =
				process.env.NODE_ENV === "production"
					? process.env.NEXT_PUBLIC_APP_URL || host
					: host;

			if (refererUrl.host !== expectedHost) {
				logger.warn("CSRF validation failed - invalid referer", {
					referer: refererUrl.host,
					expectedHost,
					path: request.nextUrl.pathname,
				});
				return false;
			}
		}

		// Allow requests without origin/referer for same-origin requests
		// This handles cases where the request is made from the same domain
		return true;
	} catch (error) {
		logger.error("CSRF validation error", error as Error, {
			path: request.nextUrl.pathname,
		});
		return false;
	}
}

/**
 * Generate CSRF token (for future use if needed)
 */
export function generateCSRFToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		""
	);
}

/**
 * Validate CSRF token (for future use if needed)
 */
export function validateCSRFToken(
	token: string,
	sessionToken: string
): boolean {
	if (!token || !sessionToken) return false;
	return token === sessionToken;
}
