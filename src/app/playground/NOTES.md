# Accessibility Comparison: Manual vs. Shadcn UI

This document compares my manual accessibility implementations against the newly generated shadcn/ui components (which use `@base-ui/react` primitives under the hood).

## Dialog (Modal)

### 1. Primitive Composition vs. Monolithic Component
- **My Implementation:** I created a single monolithic `<Modal>` component that takes `triggerText`, `title`, and `children` as props.
- **Shadcn (Base UI):** Uses a compound component pattern (`Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, etc.).
- **Why it matters:** The shadcn approach provides immense flexibility. You can place the trigger anywhere, compose custom headers/footers, and style sub-components independently without passing dozens of props. It improves maintainability and makes it much easier to build complex UIs.

### 2. Portal Rendering
- **My Implementation:** Rendered the modal inline next to the trigger button in the standard DOM tree.
- **Shadcn (Base UI):** Uses a `<DialogPortal>` to render the modal content at the root of the DOM (usually `<body>`).
- **Why it matters:** Portals escape local stacking contexts (`z-index`) and `overflow: hidden` constraints of parent elements. My manual implementation would break visually if placed inside a container with `overflow: hidden` or a lower `z-index`, whereas the shadcn modal will always render correctly on top of the page.

### 3. Focus Trapping & Edge Cases
- **My Implementation:** Relied on a manual `querySelectorAll` for standard focusable tags (`'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'`) and intercepted <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> to wrap focus.
- **Shadcn (Base UI):** Offloads focus trapping to the underlying Base UI primitive.
- **Why it matters:** My manual query selector approach is brittle. It fails to account for elements that are hidden (`display: none` or `visibility: hidden`), elements with `disabled` attributes, or custom focusable elements in a Shadow DOM. Base UI uses hidden "focus guards" (invisible elements at the start/end of the modal) and a robust tree walker to properly trap focus regardless of edge cases.

## Tabs

### 1. Orientation Support
- **My Implementation:** Assumed a horizontal layout and hardcoded <kbd>ArrowLeft</kbd> and <kbd>ArrowRight</kbd> keyboard navigation.
- **Shadcn (Base UI):** Accepts an `orientation="horizontal" | "vertical"` prop (defaulting to horizontal) which informs the primitive.
- **Why it matters:** If you want vertical tabs (like a sidebar menu), W3C ARIA guidelines require that <kbd>Up Arrow</kbd> and <kbd>Down Arrow</kbd> handle the navigation instead. Shadcn handles this automatically based on the orientation prop, whereas my implementation would provide the wrong keyboard interactions for a vertical layout.

### 2. Disabled Tab Behavior
- **My Implementation:** Did not implement or consider a disabled state for individual tabs.
- **Shadcn (Base UI):** Explicitly handles disabled states with visual styling (`disabled:opacity-50`, `aria-disabled:pointer-events-none`) and the primitive handles skipping disabled tabs during keyboard navigation.
- **Why it matters:** Robustness. In real applications, tabs often need to be disabled depending on user permissions or state. Base UI knows to skip disabled tabs when roaming focus via arrow keys, ensuring the user isn't trapped or focused on an inert element.

### 3. Separation of Concerns (State Management)
- **My Implementation:** Manually tracked `activeId` and `rovingId` using React state, and intercepted `onBlur` to sync the roving focus.
- **Shadcn (Base UI):** The primitive completely encapsulates the complex roving tabindex and focus management.
- **Why it matters:** Managing focus and selection state manually is error-prone. By abstracting this into the primitive, developers using shadcn can focus on styling (using `data-active` attributes) rather than complex event listeners, drastically reducing the surface area for accessibility regressions.
