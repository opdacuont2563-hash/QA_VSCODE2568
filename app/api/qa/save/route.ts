import { NextResponse } from "next/server";
import { saveRecord } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { departmentId, departmentName, fiscalYear, month, fields } = body || {};

    if (!departmentId || !departmentName || !fiscalYear || !month || !fields) {
      return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const record = saveRecord({
      departmentId,
      departmentName,
      fiscalYear,
      month,
      data: fields
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Failed to save QA record", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
  }
}
