import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "../error-boundary";

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
	if (shouldThrow) {
		throw new Error("Test error");
	}
	return <div>No error</div>;
};

describe("ErrorBoundary", () => {
	beforeEach(() => {
		// Suppress console.error for these tests since we're testing error boundaries
		jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should render children when there is no error", () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={false} />
			</ErrorBoundary>
		);

		expect(screen.getByText("No error")).toBeInTheDocument();
	});

	it("should render fallback UI when there is an error", () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Something unexpected happened. Please try refreshing the page."
			)
		).toBeInTheDocument();
	});

	it("should render custom fallback when provided", () => {
		const customFallback = <div>Custom error message</div>;

		render(
			<ErrorBoundary fallback={customFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(screen.getByText("Custom error message")).toBeInTheDocument();
	});

	it("should call onError prop when error occurs", () => {
		const onError = jest.fn();

		render(
			<ErrorBoundary onError={onError}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(onError).toHaveBeenCalledWith(
			expect.any(Error),
			expect.objectContaining({
				componentStack: expect.any(String),
			})
		);
	});

	it("should show refresh button that reloads the page", () => {
		const mockReload = jest.fn();
		Object.defineProperty(window, "location", {
			value: { reload: mockReload },
			writable: true,
		});

		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		const refreshButton = screen.getByText("Refresh Page");
		fireEvent.click(refreshButton);

		expect(mockReload).toHaveBeenCalled();
	});

	it("should show try again button that resets error state", () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		const tryAgainButton = screen.getByText("Try Again");
		fireEvent.click(tryAgainButton);

		// The error boundary should reset and show the children again
		expect(screen.getByText("No error")).toBeInTheDocument();
	});

	it("should show error details in development mode", () => {
		process.env.NODE_ENV = "development";

		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		const detailsElement = screen.getByText("Error Details (Development)");
		expect(detailsElement).toBeInTheDocument();

		fireEvent.click(detailsElement);
		expect(screen.getByText("Test error")).toBeInTheDocument();
	});

	it("should not show error details in production mode", () => {
		process.env.NODE_ENV = "production";

		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(
			screen.queryByText("Error Details (Development)")
		).not.toBeInTheDocument();
	});
});
