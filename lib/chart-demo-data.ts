/** Sample series for playground / A2UI chart demos (Northwind-themed). */

export const MAY_2026_BY_VENDOR = [
  { label: "Cvent", value: 24800 },
  { label: "AWS", value: 15000 },
  { label: "Microsoft 365", value: 10000 },
  { label: "Google Ads", value: 5000 },
] as const;

export const MONTHLY_SPEND_2026 = [
  { label: "Jan", value: 42000 },
  { label: "Feb", value: 38500 },
  { label: "Mar", value: 51200 },
  { label: "Apr", value: 47800 },
  { label: "May", value: 54800 },
  { label: "Jun", value: 49100 },
  { label: "Jul", value: 60300 },
  { label: "Aug", value: 72100 },
] as const;

export const TEAM_SPEND_BY_MONTH = {
  series: [
    { key: "engineering", label: "Engineering" },
    { key: "marketing", label: "Marketing" },
    { key: "people", label: "People" },
    { key: "finance", label: "Finance" },
  ],
  rows: [
    {
      label: "Apr",
      segments: { engineering: 22000, marketing: 8000, people: 9000, finance: 8800 },
    },
    {
      label: "May",
      segments: { engineering: 18000, marketing: 14800, people: 12000, finance: 10000 },
    },
    {
      label: "Jun",
      segments: { engineering: 21000, marketing: 11000, people: 9500, finance: 8600 },
    },
    {
      label: "Jul",
      segments: { engineering: 28000, marketing: 14200, people: 10100, finance: 8000 },
    },
  ],
} as const;

export const CHARGE_STATUS_BREAKDOWN = [
  { label: "Approved", value: 62 },
  { label: "Pending", value: 14 },
  { label: "Flagged", value: 8 },
  { label: "Over-Limit", value: 16 },
] as const;
