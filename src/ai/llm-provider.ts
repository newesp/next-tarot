import { genkit, Genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { openAI } from "genkitx-openai";
import { anthropic } from "genkitx-anthropic";

export type LLMProviderConfig = {
  provider: "google" | "openai" | "anthropic";
  model: string;
  apiKey: string;
};

// Store instances to reuse them
const aiInstances = new Map<string, Genkit>();

export function getAIInstance(config: LLMProviderConfig): Genkit {
  // Use google with default keys from .env if no API key is provided
  if (!config.apiKey && config.provider === "google") {
    // Return default instance
    const cacheKey = "default-google";
    if (aiInstances.has(cacheKey)) {
      return aiInstances.get(cacheKey)!;
    }
    const instance = genkit({
      plugins: [googleAI()],
      model: `googleai/${config.model || "gemini-2.5-flash"}`,
    });
    aiInstances.set(cacheKey, instance);
    return instance;
  }

  // Create a unique cache key based on the config
  const cacheKey = `${config.provider}-${config.model}-${config.apiKey.substring(0, 5)}`;

  if (aiInstances.has(cacheKey)) {
    return aiInstances.get(cacheKey)!;
  }

  let instance: Genkit;

  switch (config.provider) {
    case "openai":
      instance = genkit({
        plugins: [openAI({ apiKey: config.apiKey })],
        model: `openai/${config.model}`,
      });
      break;
    case "anthropic":
      instance = genkit({
        plugins: [anthropic({ apiKey: config.apiKey })],
        model: `anthropic/${config.model}`,
      });
      break;
    case "google":
    default:
      instance = genkit({
        plugins: [googleAI({ apiKey: config.apiKey })],
        model: `googleai/${config.model}`,
      });
      break;
  }

  aiInstances.set(cacheKey, instance);
  return instance;
}

// Keep the default export for backward compatibility where needed,
// though we will be migrating to dynamic resolution.
export const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash",
});
