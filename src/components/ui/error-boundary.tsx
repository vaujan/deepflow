"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "../../lib/logger";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log the error to our logging service
		logger.error("ErrorBoundary - React error caught", error, {
			componentStack: errorInfo.componentStack,
			errorBoundary: true,
		});

		// Call the onError prop if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			// Render custom fallback UI
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default fallback UI
			return (
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
						<div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
							<svg
								className="w-6 h-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-600 text-center mb-6">
							We&apos;re sorry, but something unexpected happened. Please try
							refreshing the page.
						</p>
						<div className="flex flex-col sm:flex-row gap-3">
							<button
								onClick={() => window.location.reload()}
								className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
							>
								Refresh Page
							</button>
							<button
								onClick={() =>
									this.setState({ hasError: false, error: undefined })
								}
								className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
							>
								Try Again
							</button>
						</div>
						{process.env.NODE_ENV === "development" && this.state.error && (
							<details className="mt-4">
								<summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
									Error Details (Development)
								</summary>
								<pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
									{this.state.error.stack}
								</pre>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

// Hook version for functional components
export function useErrorHandler() {
	return (error: Error, errorInfo?: string) => {
		logger.error("useErrorHandler - Error caught", error, {
			errorInfo,
			hook: true,
		});
	};
}

// Higher-order component for wrapping components
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: ReactNode
) {
	return function WrappedComponent(props: P) {
		return (
			<ErrorBoundary fallback={fallback}>
				<Component {...props} />
			</ErrorBoundary>
		);
	};
}
