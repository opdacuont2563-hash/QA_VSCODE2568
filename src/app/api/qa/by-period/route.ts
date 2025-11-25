import { NextResponse } from "next/server";
import { getRecord } from "@/lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId");
  const fiscalYear = searchParams.get("fiscalYear");
  const month = searchParams.get("month");

  if (!departmentId || !fiscalYear || !month) {
    return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  const record = getRecord(departmentId, fiscalYear, month);

  return NextResponse.json({ success: true, record: record || null });
}
