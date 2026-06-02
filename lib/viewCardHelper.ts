type Card = {
  id: string;
  source: number;
};
const CARD_WIDTH = 55;
const CARD_HEIGHT = 80;
const CARD_OVERLAP = 25;
const CARD_SPACING = CARD_WIDTH - CARD_OVERLAP;
const GROUP_GAP = 30;
const HAND_SIZE = 13;
const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const moveItem = (items: string[], from: number, to: number) => {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const getCardPosition = (globalIndex: number): number => {
  const groupWidth = CARD_WIDTH * 3 - CARD_OVERLAP * 2;

  if (globalIndex < 3) {
    // First group of 3
    return globalIndex * CARD_SPACING;
  } else if (globalIndex < 6) {
    // Second group of 3
    return GROUP_GAP + groupWidth + (globalIndex - 3) * CARD_SPACING;
  } else if (globalIndex < 9) {
    // Third group of 3
    return GROUP_GAP * 2 + groupWidth * 2 + (globalIndex - 6) * CARD_SPACING;
  } else if (globalIndex < 12) {
    // Last 4 cards (indices 9,10,11,12)
    return GROUP_GAP * 3 + groupWidth * 3 + (globalIndex - 9) * CARD_SPACING;
  } else {
    return GROUP_GAP * 4 + groupWidth * 4 + (globalIndex - 12) * CARD_SPACING;
  }
};

export {
  Card,
  getCardPosition,
  moveItem,
  clamp,
  CARD_SPACING,
  CARD_WIDTH,
  CARD_HEIGHT,
};
