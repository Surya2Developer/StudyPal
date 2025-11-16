import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  GenerateNotes,
  GenerateStudyTypeContent
} from "@/inngest/functions";

// Force Node.js runtime so built-in modules work
export const runtime = "nodejs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  streaming: "allow",
  functions: [
    GenerateNotes,
    GenerateStudyTypeContent,
  ],
});
