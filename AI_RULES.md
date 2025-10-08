# AI Development Rules

This document outlines the tech stack and coding conventions for the RESPIR web application. Adhering to these rules ensures consistency and maintainability.

## Tech Stack

- **Framework:** React (v19) with functional components and hooks.
- **Language:** TypeScript for static typing.
- **Build Tool:** Vite for fast development and optimized builds.
- **Styling:** Tailwind CSS is used for all styling. The configuration is managed directly in `index.html`.
- **State Management:** Global state is managed via React's Context API, primarily through `AppContext.tsx`. Local component state uses `useState`.
- **Routing:** A custom view-based routing system is implemented within `AppContext.tsx`. It does not use `react-router-dom`.
- **Icons:** A custom `DynamicIcon` component is used to render SVG icons from a central library.
- **Unique IDs:** The `uuid` library is used for generating unique identifiers.

## Library Usage and Coding Conventions

### State Management
- **Global State:** All global application state (e.g., current user, authentication status, current view) is managed in `context/AppContext.tsx`. To add new global state, extend the existing context.
- **Local State:** Use `useState` for simple component-level state.
- **Data State:** Course data is managed in `context/CourseContext.tsx`. Follow this pattern for other domain-specific data.
- **DO NOT** introduce external state management libraries like Redux, Zustand, or MobX.

### Styling
- **Primary Method:** Use Tailwind CSS utility classes for all styling directly within the JSX of your components.
- **Custom CSS:** Avoid writing separate `.css` files. All necessary styles should be achievable with Tailwind's utility-first approach.
- **Colors & Fonts:** Use the theme colors and fonts defined in the `tailwind.config` object within `index.html`. These are exposed as CSS variables (e.g., `bg-accent`, `font-elsie`).

### Icons
- **Usage:** Always use the `<DynamicIcon icon="IconName" />` component from `components/DynamicIcon.tsx` to display icons.
- **Adding New Icons:**
    1. Add the new SVG icon as a React component to `components/Icons.tsx`.
    2. Export the new icon component from `components/Icons.tsx`.
    3. Add the icon component to the `AVAILABLE_ICONS` map in `constants.ts` to make it available to `DynamicIcon`.

### Navigation
- **Internal Navigation:** Use the navigation functions from `useAppContext()`, such as `navigateTo('viewName')` or `handleLinkNavigation('/path')`.
- **DO NOT** install or use `react-router-dom`. The routing logic is handled by the `currentView` state in `AppContext`.

### Components
- **Structure:** All components must be functional components written in TypeScript (`.tsx`).
- **File Organization:**
    - Reusable, general-purpose components go in `src/components/`.
    - View components (pages) also go in `src/components/` (e.g., `HomepageView.tsx`, `Profile.tsx`).
    - Admin-specific components are located in `src/components/admin/`.
- **Props:** Define component props using TypeScript interfaces.

### Data and Types
- **Types:** All shared type definitions for the application must be placed in `types.ts`.
- **Constants:** All mock data, default configurations, and application-wide constants (like navigation items, settings menus) are stored in `constants.ts`.