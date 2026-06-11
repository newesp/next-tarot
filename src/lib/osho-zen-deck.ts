import { PlaceHolderImages } from "./placeholder-images";

export type OshoCardInfo = {
  id: string;
  name: string;
  chineseName: string;
  image: string;
  fallbackImageUrl: string;
};

// 79 cards mapping based on standard Osho Zen Deck
const oshoZenCardData = [
  // Major Arcana (0-21)
  { id: "0-the-fool", name: "The Fool", chineseName: "傻瓜" },
  { id: "1-existence", name: "Existence", chineseName: "存在" },
  { id: "2-inner-voice", name: "Inner Voice", chineseName: "內在的聲音" },
  { id: "3-creativity", name: "Creativity", chineseName: "創造力" },
  { id: "4-the-rebel", name: "The Rebel", chineseName: "叛逆者" },
  { id: "5-no-thingness", name: "No-Thingness", chineseName: "空" },
  { id: "6-the-lovers", name: "The Lovers", chineseName: "愛人" },
  { id: "7-awareness", name: "Awareness", chineseName: "覺知" },
  { id: "8-courage", name: "Courage", chineseName: "勇氣" },
  { id: "9-aloneness", name: "Aloneness", chineseName: "單獨" },
  { id: "10-change", name: "Change", chineseName: "改變" },
  { id: "11-breakthrough", name: "Breakthrough", chineseName: "突破" },
  { id: "12-new-vision", name: "New Vision", chineseName: "新洞見" },
  { id: "13-transformation", name: "Transformation", chineseName: "蛻變" },
  { id: "14-integration", name: "Integration", chineseName: "整合" },
  { id: "15-conditioning", name: "Conditioning", chineseName: "制約" },
  { id: "16-thunderbolt", name: "Thunderbolt", chineseName: "雷電" },
  { id: "17-silence", name: "Silence", chineseName: "寧靜" },
  { id: "18-past-lives", name: "Past Lives", chineseName: "前世" },
  { id: "19-innocence", name: "Innocence", chineseName: "天真" },
  {
    id: "20-beyond-illusion",
    name: "Beyond Illusion",
    chineseName: "超越幻象",
  },
  { id: "21-completion", name: "Completion", chineseName: "完成" },
  { id: "the-master", name: "The Master", chineseName: "師父" }, // The Master card

  // Fire (Wands) Action
  { id: "fire-master", name: "Creator", chineseName: "創造者" }, // King
  { id: "fire-guide", name: "Sharing", chineseName: "分享" }, // Queen
  { id: "fire-knight", name: "Intensity", chineseName: "強烈" }, // Knight
  { id: "fire-page", name: "Playfulness", chineseName: "遊戲的心情" }, // Page
  { id: "fire-10", name: "Suppression", chineseName: "壓抑" },
  { id: "fire-9", name: "Exhaustion", chineseName: "耗盡" },
  { id: "fire-8", name: "Traveling", chineseName: "旅行" },
  { id: "fire-7", name: "Stress", chineseName: "壓力" },
  { id: "fire-6", name: "Success", chineseName: "成功" },
  { id: "fire-5", name: "Totality", chineseName: "全心全意" },
  { id: "fire-4", name: "Participation", chineseName: "參與" },
  { id: "fire-3", name: "Experiencing", chineseName: "體驗" },
  { id: "fire-2", name: "Possibilities", chineseName: "可能性" },
  { id: "fire-1", name: "Source", chineseName: "源頭", imageId: "TheSource" },

  // Water (Cups) Emotions
  { id: "water-master", name: "Healing", chineseName: "治療" },
  { id: "water-guide", name: "Receptivity", chineseName: "接受性" },
  { id: "water-knight", name: "Trust", chineseName: "信任" },
  { id: "water-page", name: "Understanding", chineseName: "了解" },
  { id: "water-10", name: "Harmony", chineseName: "和諧" },
  { id: "water-9", name: "Laziness", chineseName: "懶惰" },
  { id: "water-8", name: "Letting Go", chineseName: "放手" },
  { id: "water-7", name: "Projections", chineseName: "投射" },
  { id: "water-6", name: "The Dream", chineseName: "夢", imageId: "Dream" },
  {
    id: "water-5",
    name: "Clinging To The Past",
    chineseName: "執著於過去",
    imageId: "ClingingToThePast",
  }, // special naming often seen
  { id: "water-4", name: "Turning In", chineseName: "向內轉" },
  { id: "water-3", name: "Celebration", chineseName: "慶祝" },
  { id: "water-2", name: "Friendliness", chineseName: "友誼" },
  { id: "water-1", name: "Going With The Flow", chineseName: "順著流走" },

  // Clouds (Swords) Mind
  { id: "cloud-master", name: "Control", chineseName: "控制" },
  { id: "cloud-guide", name: "Morality", chineseName: "道德" },
  { id: "cloud-knight", name: "Fighting", chineseName: "抗爭" },
  { id: "cloud-page", name: "Mind", chineseName: "頭腦" },
  { id: "cloud-10", name: "Rebirth", chineseName: "再生" },
  { id: "cloud-9", name: "Sorrow", chineseName: "悲傷" },
  { id: "cloud-8", name: "Guilt", chineseName: "罪惡感" },
  { id: "cloud-7", name: "Politics", chineseName: "政治" },
  { id: "cloud-6", name: "The Burden", chineseName: "負擔", imageId: "Burden" },
  { id: "cloud-5", name: "Comparison", chineseName: "比較" },
  { id: "cloud-4", name: "Postponement", chineseName: "延緩" },
  {
    id: "cloud-3",
    name: "Isolation",
    chineseName: "孤立",
    imageId: "Ice-olation",
  }, // provided in example
  { id: "cloud-2", name: "Schizophrenia", chineseName: "精神分裂" },
  { id: "cloud-1", name: "Consciousness", chineseName: "意識" },

  // Rainbows (Pentacles) Physical
  { id: "rainbow-master", name: "Abundance", chineseName: "豐富" },
  { id: "rainbow-guide", name: "Flowering", chineseName: "開花" },
  {
    id: "rainbow-knight",
    name: "Slowing Down",
    chineseName: "慢下來",
    imageId: "SlowingDown",
  }, // provided in example
  { id: "rainbow-page", name: "Adventure", chineseName: "冒險" },
  { id: "rainbow-10", name: "We Are The World", chineseName: "我們就是世界" },
  { id: "rainbow-9", name: "Ripeness", chineseName: "成熟" },
  {
    id: "rainbow-8",
    name: "The Ordinary",
    chineseName: "平凡",
    imageId: "Ordinary",
  },
  { id: "rainbow-7", name: "Patience", chineseName: "耐心" },
  { id: "rainbow-6", name: "Compromise", chineseName: "妥協" },
  {
    id: "rainbow-5",
    name: "The Outsider",
    chineseName: "局外人",
    imageId: "Outsider",
  },
  {
    id: "rainbow-4",
    name: "The Miser",
    chineseName: "守財奴",
    imageId: "Miser",
  },
  { id: "rainbow-3", name: "Guidance", chineseName: "指引" },
  {
    id: "rainbow-2",
    name: "Moment To Moment",
    chineseName: "一個片刻接著一個片刻",
  },
  { id: "rainbow-1", name: "Maturity", chineseName: "成熟" },
];

function getImageUrl(name: string, imageId?: string): string {
  const baseUrl = "https://raw.githubusercontent.com/danikrs/interactive-frontend/master/assets/images/";

  if (imageId) {
    return `${baseUrl}${imageId}-name.jpg`;
  }

  // Convert "The Fool" to "TheFool", "Inner Voice" to "InnerVoice" (PascalCase)
  const pascalCase = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  return `${baseUrl}${pascalCase}-name.jpg`;
}

export const oshoZenDeck: OshoCardInfo[] = oshoZenCardData.map((card) => ({
  id: card.id,
  name: card.name,
  chineseName: card.chineseName,
  image: getImageUrl(card.name, card.imageId),
  // fallback image logic, defaulting to the waite card back if it fails
  fallbackImageUrl:
    PlaceHolderImages.find((img) => img.id === "card-back")?.imageUrl || "",
}));

export function shuffleAndDrawOshoCard(): OshoCardInfo {
  const randomIndex = Math.floor(Math.random() * oshoZenDeck.length);
  return oshoZenDeck[randomIndex];
}
