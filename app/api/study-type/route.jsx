import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, studyType } = await req.json();
    console.log("📘 Fetching study content for:", courseId, studyType);

    // Step 1: Validate input
    if (!courseId || !studyType) {
      return NextResponse.json(
        { error: "Missing courseId or studyType" },
        { status: 400 }
      );
    }

    // Step 2: Initialize a response variable
    let result = {};

    // Step 3: Handle ALL study types (Notes + Flashcard + Quiz + QA)
    if (studyType === "ALL") {
      console.log("🧠 Fetching ALL study content for course:", courseId);

      const notes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

      const contentList = await db
        .select()
        .from(STUDY_TYPE_CONTENT_TABLE)
        .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

      result = {
        notes: notes ?? [],
        flashcard: contentList?.filter((item) => item.type === "Flashcard") ?? [],
        quiz: contentList?.filter((item) => item.type === "Quiz") ?? [],
        qa: contentList?.filter((item) => item.type === "QA") ?? [],
      };
    }

    // Step 4: Handle only notes
    else if (studyType === "notes") {
      console.log("📄 Fetching NOTES for:", courseId);

      const notes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

      result = { notes: notes ?? [] };
    }

    // Step 5: Handle specific type (Flashcard / Quiz / QA)
    else {
      console.log(`🎯 Fetching ${studyType.toUpperCase()} for:`, courseId);

      const content = await db
        .select()
        .from(STUDY_TYPE_CONTENT_TABLE)
        .where(
          and(
            eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
            eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)
          )
        );

      result = { content: content?.[0]?.content || [] };

    }

    // Step 6: Return the final JSON response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Error in /api/study-type:", error);

    // Step 7: Return structured error info
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || String(error),
        hint:
          "Ensure the 'study_type_content' and 'chapter_notes' tables exist and match your schema.js definitions.",
      },
      { status: 500 }
    );
  }
}

