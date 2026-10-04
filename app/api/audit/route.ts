import { NextResponse } from "next/server";
import { getAuditSnapshot } from "../../../lib/audit-log";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getAuditSnapshot());
}
