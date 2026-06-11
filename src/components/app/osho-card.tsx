"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { type OshoCardInfo } from "@/lib/osho-zen-deck";

export interface DrawnOshoCard extends OshoCardInfo {
  flipped: boolean;
}

type OshoCardProps = {
  card: DrawnOshoCard;
  isInteractive?: boolean;
  onClick?: () => void;
};

export function OshoCard({
  card,
  isInteractive = false,
  onClick,
}: OshoCardProps) {
  const [frontImageSrc, setFrontImageSrc] = useState(card.image);

  const handleFrontImageError = () => {
    setFrontImageSrc(card.fallbackImageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-[160px] sm:w-[220px]">
      <div className="text-teal-400 font-headline text-sm font-semibold tracking-wider">
        ✦ 奧修禪卡（主）
      </div>
      <div
        onClick={onClick}
        className={cn(
          "w-full aspect-[200/350] relative transition-transform duration-700",
          "transform-style-3d",
          card.flipped && "[transform:rotateY(180deg)]",
          isInteractive && "cursor-pointer",
        )}
      >
        {/* Back of the card (Teal themed border) */}
        <div className="absolute inset-0 w-full h-full rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.4)] bg-card border-2 border-teal-500/60 p-2 backface-hidden">
          <div className="relative h-full w-full overflow-hidden rounded-md bg-teal-900/30 flex items-center justify-center">
            <div className="text-teal-500/50 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-teal-500/50 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-teal-500/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Front of the card */}
        <div className="absolute inset-0 w-full h-full rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.4)] bg-card border-2 border-teal-500/60 p-2 backface-hidden [transform:rotateY(180deg)]">
          <div className="relative h-full w-full overflow-hidden rounded-md">
            <Image
              src={frontImageSrc}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 160px, 220px"
              className="object-cover"
              onError={handleFrontImageError}
              unoptimized
            />
          </div>
        </div>
      </div>
      <p className="font-headline text-sm text-center text-teal-400 h-10 flex items-center justify-center flex-col">
        {card.flipped ? (
          <>
            <span className="font-bold">{card.chineseName}</span>
            <span className="text-xs opacity-80">{card.name}</span>
          </>
        ) : (
          <>&nbsp;</>
        )}
      </p>
    </div>
  );
}
