# Accessibility Audit

## Tools Used
- **Tool:** `@axe-core/playwright`
- **Standard:** WCAG 2.1 AA

## Audited Routes
- `/` (Home)
- `/analysis` (Career Chat)

## Initial Audit Results
The initial automated audit of both routes passed with **0 WCAG AA violations**.

## Improvements Made
Even though the automated audit detected no structural violations, a manual review of the navigation layout revealed that multiple `<nav>` elements were present (one for desktop, one for mobile), which can be confusing for screen reader users trying to jump to landmarks.

**Concrete Fix:**
Added descriptive `aria-label` attributes to the navigation blocks in `src/app/layout.tsx`.
- Desktop navigation received `aria-label="Main Navigation"`
- Mobile navigation received `aria-label="Mobile Navigation"`

## Final Result
0 WCAG AA Violations remain on primary audited routes.

## Limitations of Automated Testing
Automated tools like `axe-core` are limited to programmatic, structural checks (like color contrast, missing alt attributes, and ARIA roles). They cannot fully simulate manual keyboard navigation (e.g., verifying logical focus trapping in the generative UI tool results) or test the actual semantic quality and cognitive flow of screen reader announcements. Manual testing with actual assistive technologies would be required for full confidence.
