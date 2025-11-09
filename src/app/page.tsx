"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { tarotDeck, type TarotCardInfo, shuffleAndDrawCards } from "@/lib/tarot-deck";
import { getTarotInterpretation } from "./actions";
import { Wand2, AlertTriangle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

type DrawnCard = TarotCardInfo & {
  reversed: boolean;
  flipped: boolean;
};

type ReadingState = "initial" | "drawing" | "reading" | "results";

const formSchema = z.object({
  question: z
    .string()
    .min(10, { message: "請輸入至少10個字元的問題。" })
    .max(200, { message: "問題不能超過200個字元。" }),
  spreadType: z.enum(["3-card", "5-card"]),
});

const DAILY_LIMIT = 3;

export default function Home() {
  const [readingState, setReadingState] = useState<ReadingState>("initial");
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [dailyCount, setDailyCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "我的未來會是如何？",
      spreadType: "3-card",
    },
  });

  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem('tarotReadingData');
      if (storedData) {
        const { date, count } = JSON.parse(storedData);
        if (date === today) {
          setDailyCount(count);
          if (count >= DAILY_LIMIT) {
            setLimitReached(true);
          }
        } else {
          // New day, reset count
          localStorage.setItem('tarotReadingData', JSON.stringify({ date: today, count: 0 }));
          setDailyCount(0);
        }
      } else {
        // No data stored, initialize
        localStorage.setItem('tarotReadingData', JSON.stringify({ date: today, count: 0 }));
      }
    } catch (error) {
      console.error("無法讀取 localStorage:", error);
    }
  }, []);

  const theFoolCard = useMemo(() => tarotDeck.find(card => card.id === 'the-fool'), []);

  useEffect(() => {
    if (readingState === 'drawing' && drawnCards.length > 0 && drawnCards.every(card => card.flipped)) {
      setReadingState("reading");
      startTransition(async () => {
        const result = await getTarotInterpretation({
          question: form.getValues("question"),
          spreadType: form.getValues("spreadType"),
          cards: drawnCards,
        });
        if (result.success) {
          setInterpretation(result.interpretation);
        } else {
          setInterpretation(`發生錯誤： ${result.error}`);
        }
        setReadingState("results");
      });
    }
  }, [drawnCards, readingState, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (limitReached) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const newCount = dailyCount + 1;
      localStorage.setItem('tarotReadingData', JSON.stringify({ date: today, count: newCount }));
      setDailyCount(newCount);
      if (newCount >= DAILY_LIMIT) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error("無法寫入 localStorage:", error);
    }

    setReadingState("drawing");
    setInterpretation(null);

    const cardCount = values.spreadType === "3-card" ? 3 : 5;
    const drawn = shuffleAndDrawCards(tarotDeck, cardCount).map(card => ({
      ...card,
      reversed: Math.random() > 0.5,
      flipped: false,
    }));
    setDrawnCards(drawn);
  };
  
  function handleCardClick(index: number) {
    if (readingState === 'drawing' && !drawnCards[index].flipped) {
      setDrawnCards(prevCards => {
        const newCards = [...prevCards];
        newCards[index] = { ...newCards[index], flipped: true };
        return newCards;
      });
    }
  }

  function handleRestart() {
    form.reset({ question: "我的未來會是如何？", spreadType: "3-card" });
    setReadingState("initial");
    setDrawnCards([]);
    setInterpretation(null);
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
                            placeholder="描述您關於愛情、事業或人生道路的疑問..."
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
                          選擇一個牌陣
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
                                三張牌牌陣
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="5-card" />
                              </FormControl>
                              <FormLabel className="font-normal text-foreground">
                                五張牌牌陣
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={limitReached}>
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
            <h2 className="mb-4 font-headline text-4xl text-primary">您的塔羅牌解讀</h2>
            {readingState === 'drawing' && <p className="mb-8 text-muted-foreground">點擊牌卡来翻開它們</p>}
            <div className="mb-10 flex flex-wrap justify-center gap-4 sm:gap-6" style={{ perspective: '1000px' }}>
              {drawnCards.map((card, index) => (
                <div key={card.id + index} className="animate-in fade-in-0 zoom-in-95" style={{animationDelay: `${index * 150}ms`}} onClick={() => handleCardClick(index)}>
                  <TarotCard card={card} isInteractive={readingState === 'drawing'} />
                </div>
              ))}
            </div>
            
            {(readingState === 'reading' || readingState === 'results') && (
              <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm mt-8">
                <CardContent className="p-8 text-left">
                  <h3 className="font-headline text-2xl text-primary mb-4">AI 解讀</h3>
                  {isPending || readingState === 'reading' ? (
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <Loader className="h-6 w-6" />
                      <p>AI 正在解讀您的牌卡...</p>
                    </div>
                  ) : (
                    <div className="prose prose-invert text-foreground/90 whitespace-pre-wrap font-body text-base leading-relaxed">
                      {interpretation}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Button onClick={handleRestart} size="lg" variant="outline" className="mt-8" disabled={isPending}>
              再問一個問題
            </Button>
          </div>
        );
    }
  };

  return (
    <main className="container relative mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
      {theFoolCard && (
         <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
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
      <div className="flex flex-col items-center gap-2 mb-12">
        <Wand2 className="h-16 w-16 text-primary" />
        <h1 className="font-headline text-5xl tracking-wider text-primary sm:text-7xl">
          神秘指引
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">您的 AI 塔羅指南</p>
      </div>
      {renderContent()}
    </main>
  );
}
