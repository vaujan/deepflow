# Widget Toggle Implementation

This document describes the implementation of the widget toggle system in the DeepFlow application.

## Overview

The widget toggle system allows users to show/hide different widgets (Kanban, Notes, Tasks) from the header navigation. Widgets can be toggled independently and their states are persisted across page refreshes.

## Components

### 1. Header Component (`src/components/ui/header.tsx`)

- Contains three toggle buttons for each widget type
- Uses the `useWidgets` hook to manage widget states
- Shows active indicators (blue underline) for active widgets
- Buttons change appearance based on active state (primary vs ghost)

### 2. Widget Components

- **WidgetKanban** (`src/components/ui/widget-kanban.tsx`): A simple Kanban board with three columns
- **WidgetNotes** (`src/components/ui/widget-notes.tsx`): Note-taking widget with add/delete functionality
- **WidgetTask** (`src/components/ui/widget-task.tsx`): Task management with priority levels and completion tracking

### 3. useWidgets Hook (`src/hooks/useWidgets.tsx`)

- Manages the state of active widgets
- Provides `toggleWidget` function to add/remove widgets
- Persists widget states in localStorage
- Returns `[activeWidgets, toggleWidget]` tuple

### 4. Main Page (`src/app/page.tsx`)

- Conditionally renders widgets based on their active state
- Only shows the widgets section when at least one widget is active
- Responsive layout that adjusts based on which widgets are visible

## How It Works

1. **Initialization**: Widget states are loaded from localStorage on page load
2. **Toggling**: Clicking a widget button in the header toggles its visibility
3. **State Management**: Active widgets are stored in React state and synchronized with localStorage
4. **Rendering**: Widgets are conditionally rendered based on their active state
5. **Persistence**: Widget states persist across page refreshes and browser sessions

## Usage

### Toggle Widgets

- Click the Kanban button (📋) to show/hide the Kanban board
- Click the Notes button (📓) to show/hide the Notes widget
- Click the Tasks button (🎨) to show/hide the Tasks widget

### Widget Features

#### Kanban Widget

- Three-column layout (To Do, In Progress, Done)
- Sample task cards with drag indicators
- Add new column functionality (button included)

#### Notes Widget

- Add new notes with title and content
- Delete existing notes
- Click to select/activate notes
- Timestamp tracking

#### Tasks Widget

- Add new tasks with priority selection
- Mark tasks as complete/incomplete
- Delete tasks
- Priority-based color coding

## Technical Details

- **State Management**: React hooks with localStorage persistence
- **Styling**: DaisyUI components with Tailwind CSS
- **Responsiveness**: Flexbox layouts that adapt to content
- **Performance**: Conditional rendering prevents unnecessary DOM elements
- **Accessibility**: Proper button titles and semantic HTML

## Testing

A test page is available at `/test-widgets` to verify the functionality:

- Shows all widget controls in one place
- Displays active widget status
- Allows testing all widget types independently

## Future Enhancements

- Drag and drop functionality for Kanban
- Rich text editing for Notes
- Task categories and filtering
- Widget resizing and positioning
- Keyboard shortcuts for toggling
- Widget configuration options
