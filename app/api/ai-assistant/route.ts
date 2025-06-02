import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Use the GEMINI_API_KEY environment variable
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set")
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash", { apiKey }),
      system: `You are a professional first aid assistant. Provide clear, step-by-step first aid instructions for emergency situations. Always remind users to call emergency services (108 in India) for serious emergencies. Keep responses concise but comprehensive. Focus on immediate actions that can be taken safely by untrained individuals. Always emphasize safety and when to seek professional medical help.`,
      prompt: `User is asking about: ${message}. Provide first aid guidance.`,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Error in AI assistant:", error)
    return Response.json({
      response:
        "I'm sorry, I'm having trouble connecting to my knowledge base right now. For emergency first aid information, please try again in a moment or call emergency services at 108 for immediate assistance.",
    })
  }
}
