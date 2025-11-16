import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.select().from(STUDY_TYPE_CONTENT_TABLE).limit(1);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

