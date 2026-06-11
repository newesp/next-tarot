import { PlaceHolderImages } from "./placeholder-images";

export type TarotCardInfo = {
  id: string;
  name: string;
  image: string;
  fallbackImageUrl: string;
  hint: string;
};

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const cardBackObject = PlaceHolderImages.find((img) => img.id === "card-back");
if (!cardBackObject) {
  throw new Error(
    "Fatal: Card back image data not found in placeholder-images.json. This is required.",
  );
}
export const cardBackImage = cardBackObject.imageUrl;
export const cardBackFallbackImage = cardBackObject.fallbackImageUrl;

export const tarotDeck: TarotCardInfo[] = PlaceHolderImages.filter(
  (img) => img.id !== "card-back",
).map((img) => ({
  id: img.id,
  name: titleCase(img.id),
  image: img.imageUrl,
  fallbackImageUrl: img.fallbackImageUrl,
  hint: img.imageHint,
}));

if (tarotDeck.length !== 78) {
  console.warn(
    `Warning: Tarot deck should have 78 cards, but found ${tarotDeck.length}. Check placeholder-images.json for missing cards.`,
  );
}

export function shuffleAndDrawCards(
  deck: TarotCardInfo[],
  count: number,
): TarotCardInfo[] {
  const shuffled = [...deck].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
