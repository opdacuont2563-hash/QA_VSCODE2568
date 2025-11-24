import { NextResponse } from "next/server";
import { getYearRecords } from "@/lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId");
  const fiscalYear = searchParams.get("fiscalYear");

  if (!departmentId || !fiscalYear) {
    return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  const records = getYearRecords(departmentId, fiscalYear);
  const data: Record<string, { id: string; updatedAt: string }> = {};

  for (const rec of records) {
    data[rec.month] = { id: rec.id, updatedAt: rec.updatedAt };
  }

  return NextResponse.json({ success: true, data });
}
