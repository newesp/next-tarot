"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAtomValue } from "jotai";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TarotCard } from "@/components/app/tarot-card";
import { OshoCard, type DrawnOshoCard } from "@/components/app/osho-card";
import { SettingsModal } from "@/components/app/settings-modal";
import {
  tarotDeck,
  type TarotCardInfo,
  shuffleAndDrawCards,
} from "@/lib/tarot-deck";
import { oshoZenDeck, shuffleAndDrawOshoCard } from "@/lib/osho-zen-deck";
import { llmSettingsAtom } from "@/lib/settings";
import { getTarotInterpretation, continueTarotReadingChat } from "./actions";
import { Wand2, AlertTriangle, Send, RefreshCcw } from "lucide-react";
import { Loader } from "@/components/ui/loader";

type DrawnCard = TarotCardInfo & {
  reversed: boolean;
  flipped: boolean;
};

type ReadingState = "initial" | "drawing" | "reading" | "results";

const formSchema = z.object({
  question: z.string().min(1, { message: "請輸入您的問題。" }),
  spreadType: z.enum(["3-card", "5-card"]),
});

const DAILY_LIMIT = 3;

export default function Home() {
  const llmSettings = useAtomValue(llmSettingsAtom);

  const [readingState, setReadingState] = useState<ReadingState>("initial");
  const [drawnWaiteCards, setDrawnWaiteCards] = useState<DrawnCard[]>([]);
  const [drawnOshoCard, setDrawnOshoCard] = useState<DrawnOshoCard | null>(
    null,
  );
  type Message = { role: "model" | "user"; content: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [dailyCount, setDailyCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      spreadType: "3-card",
    },
  });

  useEffect(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const storedData = localStorage.getItem("tarotReadingData");
      if (storedData) {
        const { date, count } = JSON.parse(storedData);
        if (date === today) {
          setDailyCount(count);
          if (count >= DAILY_LIMIT) {
            setLimitReached(true);
          }
        } else {
          // New day, reset count
          localStorage.setItem(
            "tarotReadingData",
            JSON.stringify({ date: today, count: 0 }),
          );
          setDailyCount(0);
        }
      } else {
        // No data stored, initialize
        localStorage.setItem(
          "tarotReadingData",
          JSON.stringify({ date: today, count: 0 }),
        );
      }
    } catch (error) {
      console.error("無法讀取 localStorage:", error);
    }
  }, []);

  const theFoolCard = useMemo(
    () => tarotDeck.find((card) => card.id === "the-fool"),
    [],
  );

  useEffect(() => {
    if (
      readingState === "drawing" &&
      drawnOshoCard?.flipped &&
      drawnWaiteCards.length > 0 &&
      drawnWaiteCards.every((card) => card.flipped)
    ) {
      setReadingState("reading");
      startTransition(async () => {
        const result = await getTarotInterpretation({
          question: form.getValues("question") || "無特定問題",
          oshoCard: {
            name: drawnOshoCard.name,
            chineseName: drawnOshoCard.chineseName,
          },
          cards: drawnWaiteCards,
          llmConfig: llmSettings,
        });

        if (result.success) {
          setMessages([{ role: "model", content: result.interpretation || "無回應" }]);
        } else {
          setMessages([{ role: "model", content: `發生錯誤： ${result.error || "未知錯誤"}` }]);
        }
        setReadingState("results");
      });
    }
  }, [drawnWaiteCards, drawnOshoCard, readingState, form, llmSettings]);

  const handleChatSubmit = () => {
    if (!chatInput.trim() || isChatting || !drawnOshoCard) return;

    const newMessages = [...messages, { role: "user" as const, content: chatInput }];
    setMessages(newMessages);
    setChatInput("");
    setIsChatting(true);

    startTransition(async () => {
      const result = await continueTarotReadingChat({
        question: chatInput,
        history: messages,
        oshoCard: { name: drawnOshoCard.name, chineseName: drawnOshoCard.chineseName },
        cards: drawnWaiteCards,
        llmConfig: llmSettings,
      });

      if (result.success && result.reply) {
        setMessages([...newMessages, { role: "model", content: result.reply }]);
      } else {
        setMessages([...newMessages, { role: "model", content: `發生錯誤： ${result.error || "未知錯誤"}` }]);
      }
      setIsChatting(false);
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (limitReached) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const newCount = dailyCount + 1;
      localStorage.setItem(
        "tarotReadingData",
        JSON.stringify({ date: today, count: newCount }),
      );
      setDailyCount(newCount);
      if (newCount >= DAILY_LIMIT) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error("無法寫入 localStorage:", error);
    }

    setReadingState("drawing");
    setMessages([]);
    setChatInput("");

    const oshoCard = { ...shuffleAndDrawOshoCard(), flipped: false };
    setDrawnOshoCard(oshoCard);

    const cardCount = values.spreadType === "3-card" ? 3 : 5;
    const drawn = shuffleAndDrawCards(tarotDeck, cardCount).map((card) => ({
      ...card,
      reversed: Math.random() > 0.5,
      flipped: false,
    }));
    setDrawnWaiteCards(drawn);
  };

  function handleWaiteCardClick(index: number) {
    if (readingState === "drawing" && !drawnWaiteCards[index].flipped) {
      setDrawnWaiteCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[index] = { ...newCards[index], flipped: true };
        return newCards;
      });
    }
  }

  function handleOshoCardClick() {
    if (readingState === "drawing" && drawnOshoCard && !drawnOshoCard.flipped) {
      setDrawnOshoCard({ ...drawnOshoCard, flipped: true });
    }
  }

  function handleRestart() {
    form.reset({ question: "", spreadType: "3-card" });
    setReadingState("initial");
    setDrawnWaiteCards([]);
    setDrawnOshoCard(null);
    setMessages([]);
    setChatInput("");
  }

  const renderContent = () => {
    switch (readingState) {
      case "initial":
        return (
          <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
            <CardContent className="p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-headline text-primary">
                          您想問什麼問題？
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="描述您關於愛情、事業或人生道路的疑問（可留白）..."
                            className="text-base"
                            rows={4}
                            {...field}
                            disabled={limitReached}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spreadType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xl font-headline text-primary">
                          選擇偉特牌陣長度
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-8"
                            disabled={limitReached}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="3-card" />
                              </FormControl>
                              <FormLabel className="font-normal text-foreground">
                                三張牌
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="5-card" />
                              </FormControl>
                              <FormLabel className="font-normal text-foreground">
                                五張牌
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={limitReached}
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    開始抽牌
                  </Button>
                  {limitReached && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400 p-3 bg-yellow-900/20 rounded-md">
                      <AlertTriangle className="h-5 w-5" />
                      <p>您今日的占卜次數已達上限。請明天再來！</p>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        );
      case "drawing":
      case "reading":
      case "results":
        return (
          <div className="w-full max-w-7xl animate-in fade-in-0 flex flex-col items-center">
            <h2 className="mb-4 font-headline text-4xl text-primary">
              您的塔羅牌解讀
            </h2>
            {readingState === "drawing" && (
              <p className="mb-8 text-muted-foreground">點擊牌卡来翻開它們</p>
            )}

            <div
              className="w-full flex flex-col items-center gap-12"
              style={{ perspective: "1000px" }}
            >
              {/* Osho Zen Card Row - Main Focus */}
              {drawnOshoCard && (
                <div className="flex justify-center animate-in fade-in-0 zoom-in-95">
                  <OshoCard
                    card={drawnOshoCard}
                    isInteractive={readingState === "drawing"}
                    onClick={handleOshoCardClick}
                  />
                </div>
              )}

              {/* Rider Waite Cards Row */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-6 relative w-full px-2">
                <div className="absolute -top-8 text-primary/70 font-headline text-sm tracking-widest w-full text-center">
                  偉特牌（輔）
                </div>
                {drawnWaiteCards.map((card, index) => (
                  <div
                    key={card.id + index}
                    className="animate-in fade-in-0 zoom-in-95 w-[31%] max-w-[200px] flex justify-center"
                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                    onClick={() => handleWaiteCardClick(index)}
                  >
                    <TarotCard
                      card={card}
                      isInteractive={readingState === "drawing"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {(readingState === "reading" || readingState === "results") && (
              <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm mt-12">
                <CardContent className="p-8 text-left">
                  <h3 className="font-headline text-2xl text-primary mb-4 flex items-center gap-2">
                    <Wand2 className="w-6 h-6 text-teal-400" />
                    AI 解讀
                  </h3>
                  <div className="space-y-6">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`p-4 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-primary/10 ml-8 md:ml-16 border border-primary/20' : 'bg-card/40 mr-8 md:mr-16 border border-white/5'}`}>
                        <div className="prose prose-invert max-w-none text-foreground/90 whitespace-pre-wrap font-body text-base leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {(isPending || isChatting || readingState === "reading") && (
                      <div className="flex items-center gap-4 text-muted-foreground p-4 bg-card/40 rounded-xl mr-8 md:mr-16 border border-white/5 shadow-sm">
                        <Loader className="h-6 w-6" />
                        <p>{isChatting ? "AI 思考中..." : "AI 正在融合禪意為您解讀牌卡..."}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <main className="container relative mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center pb-24">
      <SettingsModal />
      {theFoolCard && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 hidden md:block">
          <Image
            src={theFoolCard.image}
            alt={theFoolCard.name}
            width={80}
            height={140}
            className="w-20 h-auto rounded-md shadow-lg"
            data-ai-hint={theFoolCard.hint}
          />
        </div>
      )}
      <div className="flex flex-col items-center gap-2 mb-12 mt-12 sm:mt-0">
        <Wand2 className="h-16 w-16 text-primary" />
        <h1 className="font-headline text-5xl tracking-wider text-primary sm:text-7xl">
          神秘指引
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          奧修禪卡與偉特牌的 AI 指南
        </p>
      </div>
      {renderContent()}

      {/* Sticky Bottom Chat Input */}
      {(readingState === "results" || readingState === "reading") && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-50 flex justify-center animate-in slide-in-from-bottom-10">
          <div className="w-full max-w-4xl flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handleRestart} className="shrink-0 h-12 w-12 rounded-full border-primary/50 hover:bg-primary/10" title="重新抽牌">
              <RefreshCcw className="h-5 w-5 text-primary" />
            </Button>
            <div className="flex-1 relative flex items-center">
              <Textarea 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="針對牌面繼續提問..."
                className="min-h-[48px] max-h-[150px] pr-12 py-3 resize-none bg-card rounded-2xl shadow-inner border-primary/30 focus-visible:ring-primary/50 text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit();
                  }
                }}
                disabled={isChatting || isPending || readingState === "reading"}
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || isChatting || isPending || readingState === "reading"}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
