import { NextResponse } from "next/server";
import { deleteRecord } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { departmentId, fiscalYear, month } = body || {};

    if (!departmentId || !fiscalYear || !month) {
      return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const removed = deleteRecord(departmentId, fiscalYear, month);

    if (!removed) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อมูลที่ต้องการลบ" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete QA record", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" }, { status: 500 });
  }
}
