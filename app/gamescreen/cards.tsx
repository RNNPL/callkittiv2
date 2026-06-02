import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getCardPosition, moveItem } from "../../lib/viewCardHelper";
import { CardItem } from "./CardItem";
const CARD_WIDTH = 55;
const CARD_HEIGHT = 80;
const CARD_OVERLAP = 25;
const CARD_SPACING = CARD_WIDTH - CARD_OVERLAP;
const GROUP_GAP = 30;
const HAND_SIZE = 13;

type Card = {
  id: string;
  source: number;
};

const fullDeck: string[] = [
  "AH",
  "2H",
  "3H",
  "4H",
  "5H",
  "6H",
  "7H",
  "8H",
  "9H",
  "10H",
  "JH",
  "QH",
  "KH",
  "AD",
  "2D",
  "3D",
  "4D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "10D",
  "JD",
  "QD",
  "KD",
  "AC",
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C",
  "9C",
  "10C",
  "JC",
  "QC",
  "KC",
  "AS",
  "2S",
  "3S",
  "4S",
  "5S",
  "6S",
  "7S",
  "8S",
  "9S",
  "10S",
  "JS",
  "QS",
  "KS",
];

// algorithm fisher yaates
const pickRandomCards = (count: number): string[] => {
  const deck = [...fullDeck];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count);
};

// Get card position based on group structure (3,3,3,4)

const Cards: React.FC = () => {
  const [cards, setCards] = useState<string[]>(() =>
    pickRandomCards(HAND_SIZE),
  );

  const onSwap = useCallback((from: number, to: number) => {
    setCards((prev) => moveItem(prev, from, to));
  }, []);

  // Get grouped cards for combination determination
  const getCardGroups = useCallback((): string[][] => {
    const groups: string[][] = [
      [], // Group 0: first 3 cards
      [], // Group 1: second 3 cards
      [], // Group 2: third 3 cards
      [], // Group 3: last 4 cards
    ];

    cards.forEach((card, index) => {
      if (index < 3) groups[0].push(card);
      else if (index < 6) groups[1].push(card);
      else if (index < 9) groups[2].push(card);
      else groups[3].push(card);
    });

    return groups;
  }, [cards]);

  // Calculate container width
  const containerWidth = useMemo(() => {
    const lastCardPosition = getCardPosition(12);
    return lastCardPosition + CARD_WIDTH + 20;
  }, []);

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      {cards.map((card, index) => (
        <CardItem
          card={card}
          index={index}
          itemCount={cards.length}
          onSwap={onSwap}
        />
      ))}
    </View>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT,
    position: "relative",
    alignSelf: "center",
  },
});
