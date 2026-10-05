/** Injected as agent context for `generateSandboxedUi` (CopilotKit openGenerativeUI.designSkill). */
export const STUDIO_OPEN_GEN_UI_DESIGN_SKILL = `When generating UI with generateSandboxedUi, match AG-UI Studio's finance demo aesthetic and prioritize clarity for data visuals.

Visual style:
- Card: white background, 1px solid #eceef2 border, 16–20px padding, 24px radius.
- Primary accent: near-black #111318. Body text: #111318. Secondary labels: #4b5563 (must stay readable on white — never #f1f3f6 or other near-white grays for text).
- Typography: system-ui, -apple-system, sans-serif. Title 15–16px / 600, subtitle 12px at #4b5563, axis labels 11px at #374151.
- Use tabular-nums for currency and percentages.

Charts and data:
- For doughnut/pie charts: include a <canvas id="chargeChart"></canvas> in html (min-height ~220px).
- Put Chart.js initialization in jsExpressions (not inline <script src> tags). The host preloads Chart.js before jsExpressions run.
- Example jsExpressions item (adjust data from agent context chargeRollup.byStatus when available):
  "new Chart(document.getElementById('chargeChart'), { type: 'doughnut', data: { labels: ['Approved','Pending','Flagged','Over-Limit'], datasets: [{ data: [62,14,8,16], backgroundColor: ['#111318','#6b7280','#9ca3af','#d1d5db'] }] }, options: { plugins: { legend: { position: 'bottom' } } } });"
- Prefer pie or doughnut when the user asks for share/breakdown by category; use bar when comparing magnitudes across many items.
- Include a short title + subtitle, formatted currency ($24,800), and a compact legend.
- Fit charts in ~320–420px height; responsive width 100%.

Output contract:
- Emit initialHeight (typically 380–480 for charts).
- placeholderMessages: 2 short lines while building.
- css: complete and self-contained.
- html: one root container; load CDN scripts in the document as needed.

This demo has no sandbox host functions — do not call Websandbox.connection.remote. Use only data from the conversation and agent context.

Accessibility: label series in the legend; do not rely on color alone.`;
