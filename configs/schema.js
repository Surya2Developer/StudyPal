import {
  pgTable,
  boolean,
  serial,
  varchar,
  json,
  jsonb,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm"; // ✅ needed for sql`CURRENT_TIMESTAMP`

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  userName: varchar().notNull(),
  email: varchar().notNull().unique(),
  isMember: boolean().default(false),
  customerId: varchar(),
  credits: integer().default(3),
  planType: varchar().default("free"),
});

export const STUDY_MATERIAL_TABLE = pgTable("studyMaterial", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default("Easy"),
  courseLayout: json(),
  createdBy: varchar().notNull(),
  createdAt: timestamp().defaultNow(),
  status: varchar().default("Generating"),
  isPublic: boolean().default(false),
  publicSlug: varchar(),
  upvotes: integer().default(0),
});

export const CHAPTER_NOTES_TABLE = pgTable("chapterNotes", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  chapterId: varchar().notNull(),
  notes: text(),
});

// ✅ Updated version — matches your new definition
export const STUDY_TYPE_CONTENT_TABLE = pgTable("study_type_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("courseId").notNull(),
  type: varchar("type").notNull(), // Flashcard, Quiz, QA
  content: jsonb("content"), // Store AI-generated content as JSON
  status: varchar("status").default("Generating"),
});

export const PAYMENT_RECORD_TABLE = pgTable("paymentRecord", {
  id: serial().primaryKey(),
  customerId: varchar(),
  sessionId: varchar(),
});

export const YOUTUBE_RECOMMENDATIONS_TABLE = pgTable("youtubeRecommendations", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  topic: varchar().notNull(),
  videoId: varchar().notNull(),
  title: varchar().notNull(),
  description: text(),
  thumbnailUrl: varchar(),
  similarityScore: integer(),
  createdAt: timestamp().defaultNow(),
});

export const FAVORITES_TABLE = pgTable("favorites", {
  id: serial().primaryKey(),
  userId: varchar().notNull(),
  courseId: varchar().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const USER_UPVOTES_TABLE = pgTable("userUpvotes", {
  id: serial().primaryKey(),
  userId: varchar().notNull(),
  studyMaterialId: integer().notNull(),
  createdAt: timestamp().defaultNow(),
});
