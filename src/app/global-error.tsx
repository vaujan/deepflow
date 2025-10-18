"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { logger } from "../lib/logger";

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		// Log the error to our logging service
		logger.error("Global error - Critical error", error, {
			digest: error.digest,
			page: "global-error",
		});
	}, [error]);

	return (
		<html>
			<body>
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
						<div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
							<AlertTriangle className="w-8 h-8 text-red-600" />
						</div>

						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Critical Error
						</h1>
						<p className="text-gray-600 mb-8">
							A critical error occurred that prevented the application from
							loading properly. Please try refreshing the page or contact
							support if the problem persists.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={reset}
								className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
							>
								<RefreshCw className="w-5 h-5 mr-2" />
								Try Again
							</button>
							<button
								onClick={() => (window.location.href = "/")}
								className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
							>
								<Home className="w-5 h-5 mr-2" />
								Go Home
							</button>
						</div>

						{process.env.NODE_ENV === "development" && (
							<details className="mt-8 text-left">
								<summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
									Error Details (Development)
								</summary>
								<div className="bg-gray-100 p-4 rounded-lg">
									<p className="text-sm font-mono text-gray-800 mb-2">
										<strong>Error:</strong> {error.message}
									</p>
									{error.digest && (
										<p className="text-sm font-mono text-gray-800 mb-2">
											<strong>Digest:</strong> {error.digest}
										</p>
									)}
									<pre className="text-xs text-gray-600 overflow-auto">
										{error.stack}
									</pre>
								</div>
							</details>
						)}

						<div className="mt-8 pt-6 border-t border-gray-200">
							<p className="text-sm text-gray-500">
								If this problem persists, please{" "}
								<a
									href="mailto:support@deepflow.app"
									className="text-blue-600 hover:text-blue-800 underline"
								>
									contact support
								</a>
								.
							</p>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
