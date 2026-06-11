"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  type TarotCardInfo,
  cardBackImage,
  cardBackFallbackImage,
} from "@/lib/tarot-deck";

interface DrawnCard extends TarotCardInfo {
  reversed: boolean;
  flipped: boolean;
}

type TarotCardProps = {
  card: DrawnCard;
  isInteractive?: boolean;
};

export function TarotCard({ card, isInteractive = false }: TarotCardProps) {
  const [frontImageSrc, setFrontImageSrc] = useState(card.image);
  const [backImageSrc, setBackImageSrc] = useState(cardBackImage);

  const handleFrontImageError = () => {
    setFrontImageSrc(card.fallbackImageUrl);
  };

  const handleBackImageError = () => {
    setBackImageSrc(cardBackFallbackImage);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-[150px] sm:w-[200px]">
      <div
        className={cn(
          "w-full aspect-[200/350] relative transition-transform duration-700",
          "transform-style-3d",
          card.flipped && "[transform:rotateY(180deg)]",
          isInteractive && "cursor-pointer",
        )}
      >
        {/* Back of the card */}
        <div className="absolute inset-0 w-full h-full rounded-xl shadow-lg bg-card border-2 border-primary/50 p-2 backface-hidden">
          <div className="relative h-full w-full overflow-hidden rounded-md">
            <Image
              src={backImageSrc}
              alt="Back of a tarot card"
              fill
              sizes="(max-width: 640px) 150px, 200px"
              className="object-cover"
              data-ai-hint="tarot card back"
              onError={handleBackImageError}
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Front of the card */}
        <div className="absolute inset-0 w-full h-full rounded-xl shadow-lg bg-card border-2 border-primary/50 p-2 backface-hidden [transform:rotateY(180deg)]">
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-md",
              card.reversed && "rotate-180",
            )}
          >
            <Image
              src={frontImageSrc}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 150px, 200px"
              className="object-cover"
              data-ai-hint={card.hint}
              onError={handleFrontImageError}
              unoptimized
            />
          </div>
        </div>
      </div>
      <p className="font-headline text-sm text-center text-primary h-10 flex items-center justify-center">
        {card.flipped ? (
          <>
            {card.name}
            {card.reversed && " (逆位)"}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </p>
    </div>
  );
}

// Add these utility classes to globals.css if they don't exist
// .transform-style-3d { transform-style: preserve-3d; }
// .backface-hidden { backface-visibility: hidden; }
