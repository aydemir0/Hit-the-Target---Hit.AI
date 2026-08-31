# Accessibility Audit

## Tools Used
- **Tool:** `@axe-core/playwright`
- **Standard:** WCAG 2.1 AA

## Audited Routes
- `/` (Home)
- `/analysis` (Career Chat)

## Initial Audit Results
During initial evaluation, the primary routes passed automated checks. However, when run in an environment that successfully triggered the "Demo streaming mode" banner, the CI pipeline exposed a **color-contrast WCAG 2 AA violation (1.4.3)**.

- **Failing Element:** "Demo streaming mode — connect an AI provider key for live responses."
- **Initial Contrast Ratio:** 2.96:1 (foreground: `#e17100`, background: `#fff5e6`)
- **Required Ratio:** 4.5:1

## Improvements Made
**Concrete Fix 1 (Visual Contrast):**
Updated the Tailwind text color class for the demo banner from `text-amber-600` to `text-amber-900` to meet the 4.5:1 contrast requirement against the `amber-500/10` background, achieving a compliant contrast ratio. Dark mode accessibility (`dark:text-amber-400`) was preserved.

**Concrete Fix 2 (Semantic Navigation):**
Added descriptive `aria-label` attributes to the navigation blocks in `src/app/layout.tsx`.
- Desktop navigation received `aria-label="Main Navigation"`
- Mobile navigation received `aria-label="Mobile Navigation"`

## Final Result
0 WCAG AA Violations remain on primary audited routes in all modes, including Demo mode.

## Limitations of Automated Testing
Automated tools like `axe-core` are limited to programmatic, structural checks (like color contrast, missing alt attributes, and ARIA roles). They cannot fully simulate manual keyboard navigation (e.g., verifying logical focus trapping in the generative UI tool results) or test the actual semantic quality and cognitive flow of screen reader announcements. Manual testing with actual assistive technologies would be required for full confidence.
