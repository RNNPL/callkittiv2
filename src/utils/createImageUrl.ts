import { fullDeck } from "../../app/constants/card_data";
const createImageUrl = (suit: string, rank: string): string => {
  const suitLower = suit.toLowerCase();
  const rankStr = rank === "10" ? "10" : rank[0];
  return `../../assets/cards/${suitLower}_${rankStr}.png`;
};
const imageUrls = fullDeck.map((card) => createImageUrl(card.suit, card.rank));

export default imageUrls;
