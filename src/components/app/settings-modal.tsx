"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { Settings as SettingsIcon } from "lucide-react";
import { llmSettingsAtom, type LLMProvider } from "@/lib/settings";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export function SettingsModal() {
  const [settings, setSettings] = useAtom(llmSettingsAtom);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Local state for the form
  const [provider, setProvider] = useState<LLMProvider>(settings.provider);
  const [model, setModel] = useState(settings.model);
  const [apiKey, setApiKey] = useState(settings.apiKey);

  // Sync form state when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setProvider(settings.provider);
      setModel(settings.model);
      setApiKey(settings.apiKey);
    }
    setOpen(newOpen);
  };

  const handleSave = () => {
    setSettings({ provider, model, apiKey });
    toast({
      title: "設定已儲存",
      description: "您的 AI 解牌設定已更新。",
    });
    setOpen(false);
  };

  const handleClear = () => {
    const defaultProvider = "google";
    const defaultModel = "gemini-2.5-flash";
    setProvider(defaultProvider);
    setModel(defaultModel);
    setApiKey("");
    setSettings({ provider: defaultProvider, model: defaultModel, apiKey: "" });
    toast({
      title: "設定已清除",
      description: "設定已還原為預設值。",
    });
  };

  // Provider presets helper
  const handleProviderChange = (value: string) => {
    const newProvider = value as LLMProvider;
    setProvider(newProvider);
    // Auto-fill common default models
    if (newProvider === "google") setModel("gemini-2.5-flash");
    if (newProvider === "openai") setModel("gpt-4o-mini");
    if (newProvider === "anthropic") setModel("claude-3-5-sonnet-latest");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 sm:top-6 sm:right-6"
        >
          <SettingsIcon className="h-6 w-6 text-primary" />
          <span className="sr-only">設定</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI 解牌設定</DialogTitle>
          <DialogDescription>
            設定您用來解讀塔羅牌的 AI 模型與 API
            金鑰。金鑰只會儲存在您的瀏覽器中。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label>選擇 AI 供應商</Label>
            <RadioGroup
              value={provider}
              onValueChange={handleProviderChange}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="google" id="p-google" />
                <Label
                  htmlFor="p-google"
                  className="font-normal cursor-pointer"
                >
                  Google Gemini
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="openai" id="p-openai" />
                <Label
                  htmlFor="p-openai"
                  className="font-normal cursor-pointer"
                >
                  OpenAI
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anthropic" id="p-anthropic" />
                <Label
                  htmlFor="p-anthropic"
                  className="font-normal cursor-pointer"
                >
                  Anthropic Claude
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="model">模型名稱</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="例如：gemini-2.5-flash"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="輸入您的 API Key"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between w-full">
          <Button variant="outline" onClick={handleClear}>
            清除重設
          </Button>
          <Button onClick={handleSave}>儲存設定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
