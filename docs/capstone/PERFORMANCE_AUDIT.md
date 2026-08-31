# Performance Audit

## Audit Details
- **Timestamp:** 2026-08-31T13:41:40+03:00
- **Production URL:** [https://hit-ai.vercel.app](https://hit-ai.vercel.app)
- **Tool:** Lighthouse (Mobile form factor, via Chrome headless)

## Lighthouse Mobile Scores
- **Performance:** 99
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

## Important Findings
The application is extremely performant on mobile because it is heavily reliant on server-side rendering (Next.js App Router) and contains no heavy client-side images or blocking third-party scripts on the initial load. The UI relies on lightweight Tailwind CSS utility classes which inline well.

## Improvement Made
While the score was already exceptionally high (99), to ensure the most optimized mobile network experience, I added `prefetch={false}` to the Next.js `<Link>` components on the homepage. By default, Next.js prefetches all visible links on the page, which can trigger unnecessary background network requests on slower mobile connections. Opting out of aggressive prefetching preserves the high performance score for real-world cellular users without sacrificing the single-page application feel upon actual click.
