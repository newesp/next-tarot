import { atom } from "jotai";

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

const baseSettingsAtom = atom<LLMSettings>(defaultSettings);

// Internal atom to read from localStorage safely on client side
const localSettingsAtom = atom<LLMSettings, [LLMSettings], void>(
  (get) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tarotLLMSettings");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
      }
    }
    return get(baseSettingsAtom);
  },
  (get, set, newSettings: LLMSettings) => {
    set(baseSettingsAtom, newSettings);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tarotLLMSettings", JSON.stringify(newSettings));
      } catch (e) {
        console.error("Failed to save settings to localStorage", e);
      }
    }
  },
);

// Expose the writable atom
export const llmSettingsAtom = localSettingsAtom;
