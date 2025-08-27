# Sidebar Provider Usage Guide

This project now uses a centralized sidebar context provider that allows you to control the sidebar visibility from anywhere in your application, similar to how shadcn handles it.

## Features

- **Global State Management**: Sidebar state is managed globally through React Context
- **Remote Control**: Toggle the sidebar from any component without prop drilling
- **Complete Hide/Show**: Sidebar completely disappears when hidden, maximizing screen space
- **Smooth Animations**: Beautiful slide-out animations with staggered content reveals
- **Responsive Design**: Works seamlessly with DaisyUI's drawer system
- **TypeScript Support**: Full type safety with proper interfaces

## Animation Features

The sidebar includes several layers of smooth animations:

### 1. **Main Container Animation**

- **Slide Out**: Smooth horizontal slide from left to right
- **Opacity**: Fades in/out during transition
- **Scale**: Subtle scale effect for depth
- **Duration**: 500ms with ease-in-out timing

### 2. **Staggered Content Animations**

- **Navigation Items**: Each item animates in sequence with 50ms delays
- **Search Bar**: Slides up from bottom with opacity
- **Profile Section**: Smooth entrance animation
- **Duration**: 300ms with ease-out timing

### 3. **Interactive Elements**

- **Toggle Button**: Subtle rotation on hover
- **Smooth Transitions**: All interactive elements have polished transitions

## Components

### 1. SidebarProvider

The main context provider that wraps your app. Already added to `src/app/layout.tsx`.

```tsx
// This is already set up in your layout.tsx
<SidebarProvider>{children}</SidebarProvider>
```

### 2. useSidebar Hook

A custom hook that provides access to sidebar state and controls.

```tsx
import { useSidebar } from "@/src/contexts/SidebarContext";

function MyComponent() {
	const { isHidden, toggleSidebar, showSidebar, hideSidebar } = useSidebar();

	return (
		<div>
			<p>Sidebar is {isHidden ? "hidden" : "visible"}</p>
			<button onClick={toggleSidebar}>Toggle Sidebar</button>
		</div>
	);
}
```

### 3. SidebarToggle Component

A pre-built button component for toggling the sidebar.

```tsx
import { SidebarToggle } from "@/src/components/ui/sidebar-toggle";

// Basic usage
<SidebarToggle />

// With custom styling
<SidebarToggle
	variant="ghost"
	size="sm"
	className="custom-class"
/>
```

**Props:**

- `variant`: "default" | "ghost" | "outline" (default: "default")
- `size`: "sm" | "md" | "lg" (default: "md")
- `className`: Additional CSS classes

## Usage Examples

### Toggle Sidebar from Anywhere

```tsx
import { useSidebar } from "@/src/contexts/SidebarContext";

function HeaderComponent() {
	const { toggleSidebar } = useSidebar();

	return (
		<header>
			<button onClick={toggleSidebar}>Toggle Sidebar</button>
		</header>
	);
}
```

### Force Specific State

```tsx
import { useSidebar } from "@/src/contexts/SidebarContext";

function SettingsComponent() {
	const { showSidebar, hideSidebar } = useSidebar();

	const handleFullscreen = () => {
		hideSidebar(); // Force hide
	};

	const handleShowSidebar = () => {
		showSidebar(); // Force show
	};

	return (
		<div>
			<button onClick={handleFullscreen}>Fullscreen Mode</button>
			<button onClick={handleShowSidebar}>Show Sidebar</button>
		</div>
	);
}
```

### Conditional Rendering Based on Sidebar State

```tsx
import { useSidebar } from "@/src/contexts/SidebarContext";

function ResponsiveComponent() {
	const { isHidden } = useSidebar();

	return (
		<div className={isHidden ? "ml-0" : "ml-74"}>
			{isHidden ? (
				<p>Sidebar is hidden - showing full width content</p>
			) : (
				<p>Sidebar is visible - content adjusted for sidebar</p>
			)}
		</div>
	);
}
```

### Keyboard Shortcuts

```tsx
import { useSidebar } from "@/src/contexts/SidebarContext";
import { useEffect } from "react";

function KeyboardShortcuts() {
	const { toggleSidebar } = useSidebar();

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === "b") {
				e.preventDefault();
				toggleSidebar();
			}
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, [toggleSidebar]);

	return null; // This component doesn't render anything
}
```

## State Values

The `useSidebar` hook provides:

- `isHidden`: Boolean indicating if sidebar is hidden
- `toggleSidebar()`: Function to toggle between hidden/visible
- `showSidebar()`: Function to force show the sidebar
- `hideSidebar()`: Function to force hide the sidebar

## CSS Classes & Animations

The sidebar automatically applies these classes and animations:

### **Main Container**

- **Visible**: `translate-x-0 opacity-100 scale-100`
- **Hidden**: `translate-x-[-100%] opacity-0 scale-95`
- **Transition**: `transition-all duration-500 ease-in-out transform`

### **Content Elements**

- **Navigation Items**: Staggered animations with 50ms delays
- **Search Bar**: `translate-y-0 opacity-100` (visible) / `translate-y-2 opacity-0` (hidden)
- **Profile Section**: Same animation as search bar
- **Transition**: `transition-all duration-300 ease-out transform`

### **Main Content Adjustment**

- **Visible**: `ml-74` (296px left margin)
- **Hidden**: `ml-0` (no left margin)
- **Transition**: `transition-all duration-500 ease-in-out transform`

## Best Practices

1. **Use the hook**: Always use `useSidebar()` instead of managing local state
2. **Consistent UI**: Use `SidebarToggle` component for consistent toggle buttons
3. **Responsive design**: Consider sidebar state when designing responsive layouts
4. **Performance**: The context is optimized and won't cause unnecessary re-renders
5. **Accessibility**: Always provide proper labels and ARIA attributes
6. **Layout adjustment**: Adjust main content margins based on sidebar visibility
7. **Animation timing**: Respect the 500ms main animation duration for smooth transitions

## Migration from Local State

If you were previously using local state for sidebar:

**Before:**

```tsx
const [isCollapsed, setIsCollapsed] = useState(false);
```

**After:**

```tsx
const { isHidden, toggleSidebar, showSidebar, hideSidebar } = useSidebar();
```

The functionality is now more powerful - you can completely hide the sidebar with beautiful animations!

## Layout Considerations

When the sidebar is hidden, your main content can use the full width. Consider adjusting your layout:

```tsx
const { isHidden } = useSidebar();

return (
	<main
		className={`transition-all duration-500 ease-in-out transform ${
			isHidden ? "ml-0" : "ml-74"
		}`}
	>
		{/* Your content */}
	</main>
);
```

## Animation Customization

You can customize the animation timing by modifying the CSS classes in the sidebar component:

- **Main animation**: Change `duration-500` to adjust slide speed
- **Content animations**: Change `duration-300` to adjust content reveal speed
- **Stagger delays**: Modify the `50ms` delay in the navigation items loop
- **Easing**: Change `ease-in-out` or `ease-out` for different animation feels
