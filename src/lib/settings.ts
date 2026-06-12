import { atomWithStorage } from "jotai/utils";

export type LLMProvider = "google" | "openai" | "anthropic";

export interface LLMSettings {
  provider: LLMProvider;
  model: string;
  apiKey: string;
}

const defaultSettings: LLMSettings = {
  provider: "google",
  model: "gemini-2.5-flash",
  apiKey: "",
};

export const llmSettingsAtom = atomWithStorage<LLMSettings>("tarotLLMSettings", defaultSettings);
