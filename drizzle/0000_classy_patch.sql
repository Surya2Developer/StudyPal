CREATE TABLE "chapterNotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"chapterId" varchar NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"courseId" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "paymentRecord" (
	"id" serial PRIMARY KEY NOT NULL,
	"customerId" varchar,
	"sessionId" varchar
);
--> statement-breakpoint
CREATE TABLE "studyMaterial" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"courseType" varchar NOT NULL,
	"topic" varchar NOT NULL,
	"difficultyLevel" varchar DEFAULT 'Easy',
	"courseLayout" json,
	"createdBy" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"status" varchar DEFAULT 'Generating',
	"isPublic" boolean DEFAULT false,
	"publicSlug" varchar,
	"upvotes" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "study_type_content" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"content" jsonb,
	"status" varchar DEFAULT 'Generating',
	"created_at" text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"userName" varchar NOT NULL,
	"email" varchar NOT NULL,
	"isMember" boolean DEFAULT false,
	"customerId" varchar,
	"credits" integer DEFAULT 2,
	"planType" varchar DEFAULT 'free'
);
--> statement-breakpoint
CREATE TABLE "userUpvotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"studyMaterialId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "youtubeRecommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"topic" varchar NOT NULL,
	"videoId" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"thumbnailUrl" varchar,
	"similarityScore" integer,
	"createdAt" timestamp DEFAULT now()
);
