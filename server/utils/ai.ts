import {
  createGoogleGenerativeAI,
  type GoogleGenerativeAIProvider,
} from "@ai-sdk/google";

let ai: GoogleGenerativeAIProvider | null = null;
export function useAi() {
  if (ai == null) {
    const apiKey = useRuntimeConfig().googleAiApiKey;
    if (!apiKey) throw new Error("Missing AI API key");
    ai = createGoogleGenerativeAI({
      apiKey: apiKey,
    });
  }

  return ai;
}
