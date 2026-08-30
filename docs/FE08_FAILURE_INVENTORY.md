# FE-08 Failure Inventory

This document outlines the resilience scenarios and recovery mechanisms for the Hit.AI Career Analysis Chat.

| Scenario | Trigger | Expected UI | Recovery Action | Human Retry Required |
| :--- | :--- | :--- | :--- | :--- |
| **Network unavailable before send** | Client offline when form submitted | `useChat` error state, alert panel with "The response was interrupted" | User clicks "Retry response" | Yes |
| **API error before stream starts** | 500 Internal Server Error immediately | Chat-level error panel (`role="alert"`) | User clicks "Retry response" (`reload()`) | Yes |
| **Mid-stream interruption** | `[[mid-stream-error]]` demo trigger | Partial text remains, chat-level error panel appears below it | User clicks "Retry response" | Yes |
| **429 Rate limit** | `[[rate-limit]]` demo trigger | Chat-level error panel showing "Wait a moment, then retry this response." | User clicks "Retry response" after waiting | Yes |
| **Empty input** | Submitting only whitespace or blank input | Send button remains disabled; `Enter` key does not submit | User types valid text | No (prevented proactively) |
| **First-run empty state** | `messages.length === 0` | Onboarding actions (e.g. "Inspect a job posting", "Ask for interview prep") | User clicks an onboarding action | Yes |
| **No-results tool output** | `inspectJobPosting` returns no technologies and `Unknown` seniority | "No clear technical signals found" message with an action to insert a better example | User provides more detailed input | Yes |
| **Slow first response** | `[[slow-response]]` demo trigger | Skeleton/loading composition matching response card dimensions; no layout shift | Wait for response (auto-recovers) | No |
| **Malformed/unexpected tool result** | Runtime output from tool does not match expected schema | "Could not display tool result" inline error card (`role="alert"`) | User tries again or modifies input | Yes |
| **User stops generation** | Clicking "Stop" button mid-stream | Stream halts, partial text remains, no error panel shown | User continues chat normally | No |
| **Mobile Safari keyboard/viewport** | Tapping textarea on iOS | Input remains visible (`100dvh`), no forced zoom (`16px` font size) | Adjusts viewport automatically (`env(safe-area-inset-bottom)`) | No |
