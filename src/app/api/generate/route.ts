import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30; // 30 seconds max duration

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const aiModel = google("gemini-1.5-flash");

        const result = await streamText({
            model: aiModel,
            prompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: String((error as Error).message || error) }), {
            status: 500,
        });
    }
}
