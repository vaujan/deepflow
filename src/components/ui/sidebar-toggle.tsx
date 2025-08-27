"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";

interface SidebarToggleProps {
	className?: string;
	variant?: "default" | "ghost" | "outline";
	size?: "sm" | "md" | "lg";
}

export function SidebarToggle({
	className = "",
	variant = "default",
	size = "md",
}: SidebarToggleProps) {
	const { isHidden, toggleSidebar } = useSidebar();

	const baseClasses = "btn btn-square transition-all duration-200";
	const variantClasses = {
		default: "btn-primary",
		ghost: "btn-ghost",
		outline: "btn-outline",
	};
	const sizeClasses = {
		sm: "btn-sm",
		md: "btn-md",
		lg: "btn-lg",
	};

	const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

	return (
		<button
			onClick={toggleSidebar}
			className={buttonClasses}
			title={isHidden ? "Show sidebar" : "Hide sidebar"}
			aria-label={isHidden ? "Show sidebar" : "Hide sidebar"}
		>
			{isHidden ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
		</button>
	);
}
