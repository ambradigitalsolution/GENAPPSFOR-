import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30; // 30 seconds max duration

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // System prompt to enhance the idea
        const systemPrompt = `You are an expert product manager and application architect.
The user will give you a brief, potentially messy idea for an app.
Your task is to rewrite and expand it into a single, professional, comprehensive paragraph (max 3-4 sentences) that describes the app's core value proposition, target audience, and main functionality.
Do NOT include greetings, lists, or conversational filler. Just the polished description.
User's idea: ${prompt}`;

        const aiModel = google("gemini-2.5-flash");

        const result = await streamText({
            model: aiModel,
            prompt: systemPrompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: String((error as Error).message || error) }), {
            status: 500,
        });
    }
}
