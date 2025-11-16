import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { YOUTUBE_RECOMMENDATIONS_TABLE } from "@/configs/schema";
import { and, eq, desc } from "drizzle-orm";
import axios from "axios";

/* -----------------------------------------------
   Embedding helper
------------------------------------------------ */
async function getEmbedding(text) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY_2 ||
      process.env.GEMINI_API_KEY_3;

    if (!apiKey) throw new Error("Gemini API key not configured");

    console.log("🔹 Generating embedding for text (truncated):", text?.slice(0, 80));

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`,
      { content: { parts: [{ text }] } }
    );

    console.log("✅ Embedding success");
    return response.data.embedding;
  } catch (error) {
    console.error("❌ Error getting embedding:", error.response?.data || error.message);
    throw error;
  }
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    console.warn("⚠️ Invalid vectors for cosineSimilarity");
    return 0;
  }
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  const result = dotProduct / (magnitudeA * magnitudeB);
  if (isNaN(result)) console.warn("⚠️ Similarity result was NaN");
  return result;
}

async function searchYouTube(query) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

    console.log("🔍 Searching YouTube for query:", query);
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        maxResults: 10,
        q: query,
        type: "video",
        key: apiKey,
      },
    });

    console.log("🎥 YouTube API returned:", response.data.items?.length || 0, "videos");
    return response.data.items || [];
  } catch (error) {
    console.error("❌ Error searching YouTube:", error.response?.data || error.message);
    throw error;
  }
}

/* -----------------------------------------------
   ✅ FIXED GET: proper indentation & closing braces
------------------------------------------------ */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const topic = searchParams.get("topic");

    console.log("📥 GET request for courseId:", courseId, "topic:", topic);

    if (!courseId || !topic) {
      return NextResponse.json(
        { error: "Course ID and topic are required" },
        { status: 400 }
      );
    }

    const existingRecommendations = await db
      .select()
      .from(YOUTUBE_RECOMMENDATIONS_TABLE)
      .where(
        and(
          eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId),
          eq(YOUTUBE_RECOMMENDATIONS_TABLE.topic, topic)
        )
      )
      .orderBy(desc(YOUTUBE_RECOMMENDATIONS_TABLE.similarityScore))
      .limit(5);

    console.log("📦 Found existing recommendations:", existingRecommendations.length);

    if (existingRecommendations.length > 0) {
      // Deduplicate by videoId just in case DB contains old duplicates
      const seen = new Set();
      const unique = existingRecommendations.filter((r) => {
        if (seen.has(r.videoId)) return false;
        seen.add(r.videoId);
        return true;
      });

      // If duplicates found, refresh
      if (unique.length < existingRecommendations.length) {
        console.log("♻️ Detected duplicates in DB, cleaning and regenerating...");
        await db
          .delete(YOUTUBE_RECOMMENDATIONS_TABLE)
          .where(
            and(
              eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId),
              eq(YOUTUBE_RECOMMENDATIONS_TABLE.topic, topic)
            )
          );
        return NextResponse.json({ recommendations: [] }, { status: 200 });
      }

      const formatted = unique.map((r) => ({
        videoId: r.videoId,
        title: r.title,
        description: r.description,
        thumbnailUrl: r.thumbnailUrl,
        similarityScore: r.similarityScore,
      }));

      return NextResponse.json({ recommendations: formatted }, { status: 200 });
    }

    // ✅ No exact match found — clean and clear return
    return NextResponse.json({ recommendations: [] }, { status: 200 });

  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* -----------------------------------------------
   POST: generate recommendations (unchanged)
------------------------------------------------ */
export async function POST(req) {
  try {
    const body = await req.json();
    const { courseId, topic } = body;

    console.log("📥 POST request for courseId:", courseId, "| topic:", topic);

    if (!courseId || !topic) {
      return NextResponse.json(
        { error: "Course ID and topic are required" },
        { status: 400 }
      );
    }

    const existingRecommendations = await db
      .select()
      .from(YOUTUBE_RECOMMENDATIONS_TABLE)
      .where(
        and(
          eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId),
          eq(YOUTUBE_RECOMMENDATIONS_TABLE.topic, topic)
        )
      );

    if (existingRecommendations.length > 0) {
      console.log(
        `🧠 Existing recommendations found (${existingRecommendations.length}) — returning them.`
      );
      const formatted = existingRecommendations.map((r) => ({
        videoId: r.videoId,
        title: r.title,
        description: r.description,
        thumbnailUrl: r.thumbnailUrl,
        similarityScore: r.similarityScore,
      }));
      return NextResponse.json({ recommendations: formatted }, { status: 200 });
    }

    const topicEmbedding = await getEmbedding(topic);
    const youtubeResults = await searchYouTube(topic);
    if (!youtubeResults || youtubeResults.length === 0) {
      console.warn("⚠️ YouTube returned no results for:", topic);
      return NextResponse.json({ recommendations: [] });
    }

    const processedResults = await Promise.all(
      youtubeResults.map(async (video) => {
        const title = video.snippet?.title || "";
        const description = video.snippet?.description || "";
        const combinedText = `${title} ${description}`;

        try {
          const videoEmbedding = await getEmbedding(combinedText);
          const topicVec = topicEmbedding?.values || topicEmbedding;
          const videoVec = videoEmbedding?.values || videoEmbedding;
          const similarity = cosineSimilarity(topicVec, videoVec);
          const similarityScore = Math.round(similarity * 100);

          const thumbnailUrl =
            video.snippet?.thumbnails?.medium?.url ||
            video.snippet?.thumbnails?.high?.url ||
            video.snippet?.thumbnails?.default?.url ||
            "";

          const videoId =
            video.id?.videoId || (typeof video.id === "string" ? video.id : null);

          if (!videoId) return null;

          return {
            videoId,
            title,
            description,
            thumbnailUrl,
            similarityScore,
          };
        } catch (err) {
          console.error(
            "❌ Failed to embed video:",
            title,
            "|",
            err.response?.data || err.message
          );
          return null;
        }
      })
    );

    const validResults = processedResults.filter(Boolean);
    console.log("✅ Valid processed results:", validResults.length);

    const uniqueResultsMap = new Map();
    validResults.forEach((r) => {
      if (!uniqueResultsMap.has(r.videoId)) {
        uniqueResultsMap.set(r.videoId, r);
      }
    });
    const uniqueResults = Array.from(uniqueResultsMap.values());

    console.log("🧩 Unique videos after deduplication:", uniqueResults.length);

    const topResults = uniqueResults
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5);

    console.log("🏆 Top 5 unique videos selected:", topResults.map((v) => v.title));

    await db
      .delete(YOUTUBE_RECOMMENDATIONS_TABLE)
      .where(
        and(
          eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId),
          eq(YOUTUBE_RECOMMENDATIONS_TABLE.topic, topic)
        )
      );

    for (const result of topResults) {
      const existing = await db
        .select()
        .from(YOUTUBE_RECOMMENDATIONS_TABLE)
        .where(
          and(
            eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId),
            eq(YOUTUBE_RECOMMENDATIONS_TABLE.topic, topic),
            eq(YOUTUBE_RECOMMENDATIONS_TABLE.videoId, result.videoId)
          )
        );

      if (existing.length === 0) {
        await db.insert(YOUTUBE_RECOMMENDATIONS_TABLE).values({
          courseId,
          topic,
          videoId: result.videoId,
          title: result.title,
          description: result.description,
          thumbnailUrl: result.thumbnailUrl,
          similarityScore: result.similarityScore,
        });
      }
    }

    console.log("💾 Inserted results into DB successfully!");
    return NextResponse.json({ recommendations: topResults }, { status: 200 });

  } catch (error) {
    console.error(
      "❌ Error generating YouTube recommendations:",
      error.response?.data || error.message || error
    );
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
