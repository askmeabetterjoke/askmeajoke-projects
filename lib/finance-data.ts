export type DashboardTab =
  | "overview"
  | "cards"
  | "charges"
  | "transactions"
  | "reports"
  | "documents";

export type ChargeStatus = "Approved" | "Pending" | "Flagged" | "Over-Limit";

export type Charge = {
  id: string;
  merchant: string;
  category: string;
  team: string;
  date: string;
  status: ChargeStatus;
  amount: number;
  cardLast4: string;
  note?: string;
};

export type CardAccount = {
  id: string;
  brand: "visa" | "mastercard";
  last4: string;
  holder: string;
  validThru: string;
  creditLimit: number;
  available: number;
  color: "violet" | "indigo" | "fuchsia";
};

export type LedgerEntry = {
  id: string;
  merchant: string;
  kind: "Outgoing" | "Incoming";
  date: string;
  amount: number;
  note?: string;
  flagged?: boolean;
};

export const USER = {
  name: "Alex",
  role: "Finance ops lead",
  company: "Northwind Finance",
};

export const CARDS: CardAccount[] = [
  {
    id: "card-visa-4242",
    brand: "visa",
    last4: "4242",
    holder: "ALEX MORGAN",
    validThru: "08/28",
    creditLimit: 10000,
    available: 8000,
    color: "violet",
  },
  {
    id: "card-mc-1234",
    brand: "mastercard",
    last4: "1234",
    holder: "ALEX MORGAN",
    validThru: "03/29",
    creditLimit: 5000,
    available: 4500,
    color: "indigo",
  },
  {
    id: "card-visa-5555",
    brand: "visa",
    last4: "5555",
    holder: "ALEX MORGAN",
    validThru: "11/27",
    creditLimit: 15000,
    available: 13500,
    color: "fuchsia",
  },
];

export const CHARGES: Charge[] = [
  {
    id: "c1",
    merchant: "Amazon Web Services",
    category: "Cloud Infrastructure",
    team: "Engineering",
    date: "2026-08-01",
    status: "Over-Limit",
    amount: 91800,
    cardLast4: "5555",
  },
  {
    id: "c2",
    merchant: "ADP Payroll",
    category: "Payroll & Benefits",
    team: "People",
    date: "2026-08-15",
    status: "Approved",
    amount: 74200,
    cardLast4: "4242",
  },
  {
    id: "c3",
    merchant: "Wilson Sansini",
    category: "Professional Services",
    team: "Executive",
    date: "2026-05-22",
    status: "Flagged",
    amount: 58400,
    cardLast4: "1234",
  },
  {
    id: "c4",
    merchant: "Snowflake",
    category: "Cloud Infrastructure",
    team: "Engineering",
    date: "2026-05-04",
    status: "Approved",
    amount: 43250,
    cardLast4: "5555",
  },
  {
    id: "c5",
    merchant: "Google Ads",
    category: "Advertising",
    team: "Marketing",
    date: "2026-08-09",
    status: "Over-Limit",
    amount: 38600,
    cardLast4: "4242",
  },
  {
    id: "c6",
    merchant: "Deloitte",
    category: "Professional Services",
    team: "Finance",
    date: "2026-04-28",
    status: "Approved",
    amount: 34900,
    cardLast4: "1234",
  },
  {
    id: "c7",
    merchant: "Salesforce",
    category: "SaaS & Software",
    team: "Sales",
    date: "2026-05-18",
    status: "Approved",
    amount: 31200,
    cardLast4: "5555",
  },
  {
    id: "c8",
    merchant: "Meta Ads",
    category: "Advertising",
    team: "Marketing",
    date: "2026-08-11",
    status: "Pending",
    amount: 27450,
    cardLast4: "4242",
  },
  {
    id: "c9",
    merchant: "Cvent",
    category: "Marketing Events",
    team: "Marketing",
    date: "2026-05-30",
    status: "Flagged",
    amount: 24800,
    cardLast4: "1234",
  },
  {
    id: "c10",
    merchant: "Microsoft Azure",
    category: "Cloud Infrastructure",
    team: "Engineering",
    date: "2026-04-12",
    status: "Approved",
    amount: 22100,
    cardLast4: "5555",
  },
  {
    id: "c11",
    merchant: "Delta Airlines",
    category: "Travel",
    team: "Executive",
    date: "2026-04-22",
    status: "Approved",
    amount: 89.99,
    cardLast4: "4242",
  },
  {
    id: "c12",
    merchant: "Microsoft 365",
    category: "SaaS & Software",
    team: "People",
    date: "2026-05-12",
    status: "Approved",
    amount: 10000,
    cardLast4: "5555",
  },
];

export const LEDGER: LedgerEntry[] = [
  {
    id: "t1",
    merchant: "Google Ads",
    kind: "Outgoing",
    date: "2026-05-28",
    amount: -5000,
  },
  {
    id: "t2",
    merchant: "AWS",
    kind: "Outgoing",
    date: "2026-05-20",
    amount: -15000,
  },
  {
    id: "t3",
    merchant: "Microsoft 365",
    kind: "Outgoing",
    date: "2026-05-12",
    amount: -10000,
  },
  {
    id: "t4",
    merchant: "Delta Airlines",
    kind: "Outgoing",
    date: "2026-04-22",
    amount: -89.99,
  },
];

export const TEAM_BUDGETS = [
  { team: "Marketing", pending: 500, limit: 5000 },
  { team: "Executive", pending: 1000, limit: 10000 },
  { team: "Engineering", pending: 1500, limit: 15000 },
];

export const MONTHLY_SPEND = [
  { month: "Jan", spend: 182000, budget: 200000 },
  { month: "Feb", spend: 196000, budget: 200000 },
  { month: "Mar", spend: 211000, budget: 210000 },
  { month: "Apr", spend: 188000, budget: 210000 },
  { month: "May", spend: 247000, budget: 220000 },
  { month: "Jun", spend: 203000, budget: 220000 },
  { month: "Jul", spend: 229000, budget: 230000 },
  { month: "Aug", spend: 268000, budget: 230000 },
];

export const CATEGORY_SPEND = [
  { name: "Cloud", value: 157150 },
  { name: "Payroll", value: 74200 },
  { name: "Ads", value: 66050 },
  { name: "Services", value: 93300 },
  { name: "SaaS", value: 41200 },
  { name: "Travel", value: 89.99 },
];

export function totals(charges: Charge[]) {
  const spend = charges.reduce((sum, c) => sum + c.amount, 0);
  const pending = charges
    .filter((c) => c.status === "Pending" || c.status === "Flagged")
    .reduce((sum, c) => sum + c.amount, 0);
  const overLimit = charges.filter((c) => c.status === "Over-Limit").length;
  return {
    spend,
    pending,
    overLimit,
    count: charges.length,
    balance: 3000,
    income: 0,
    spendLimit: 500000,
    spendLimitUsed: Math.min(100, Math.round((spend / 500000) * 100)),
  };
}
