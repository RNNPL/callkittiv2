import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Image, PanResponder, StyleSheet, View } from "react-native";

const CARD_WIDTH = 55;
const CARD_HEIGHT = 80;
const CARD_GAP = 8;
const CARD_SPACING = CARD_WIDTH + CARD_GAP;
const HAND_SIZE = 13;

type Card = {
  id: string;
  source: number;
};

const fullDeck: Card[] = [
  { id: "clubs_2", source: require("../../assets/cards/clubs_2.png") },
  { id: "clubs_3", source: require("../../assets/cards/clubs_3.png") },
  { id: "clubs_4", source: require("../../assets/cards/clubs_4.png") },
  { id: "clubs_5", source: require("../../assets/cards/clubs_5.png") },
  { id: "clubs_6", source: require("../../assets/cards/clubs_6.png") },
  { id: "clubs_7", source: require("../../assets/cards/clubs_7.png") },
  { id: "clubs_8", source: require("../../assets/cards/clubs_8.png") },
  { id: "clubs_9", source: require("../../assets/cards/clubs_9.png") },
  { id: "clubs_10", source: require("../../assets/cards/clubs_10.png") },
  { id: "clubs_J", source: require("../../assets/cards/clubs_J.png") },
  { id: "clubs_Q", source: require("../../assets/cards/clubs_Q.png") },
  { id: "clubs_K", source: require("../../assets/cards/clubs_K.png") },
  { id: "clubs_A", source: require("../../assets/cards/clubs_A.png") },
  { id: "diamonds_2", source: require("../../assets/cards/diamonds_2.png") },
  { id: "diamonds_3", source: require("../../assets/cards/diamonds_3.png") },
  { id: "diamonds_4", source: require("../../assets/cards/diamonds_4.png") },
  { id: "diamonds_5", source: require("../../assets/cards/diamonds_5.png") },
  { id: "diamonds_6", source: require("../../assets/cards/diamonds_6.png") },
  { id: "diamonds_7", source: require("../../assets/cards/diamonds_7.png") },
  { id: "diamonds_8", source: require("../../assets/cards/diamonds_8.png") },
  { id: "diamonds_9", source: require("../../assets/cards/diamonds_9.png") },
  { id: "diamonds_10", source: require("../../assets/cards/diamonds_10.png") },
  { id: "diamonds_J", source: require("../../assets/cards/diamonds_J.png") },
  { id: "diamonds_Q", source: require("../../assets/cards/diamonds_Q.png") },
  { id: "diamonds_K", source: require("../../assets/cards/diamonds_K.png") },
  { id: "diamonds_A", source: require("../../assets/cards/diamonds_A.png") },
  { id: "hearts_2", source: require("../../assets/cards/hearts_2.png") },
  { id: "hearts_3", source: require("../../assets/cards/hearts_3.png") },
  { id: "hearts_4", source: require("../../assets/cards/hearts_4.png") },
  { id: "hearts_5", source: require("../../assets/cards/hearts_5.png") },
  { id: "hearts_6", source: require("../../assets/cards/hearts_6.png") },
  { id: "hearts_7", source: require("../../assets/cards/hearts_7.png") },
  { id: "hearts_8", source: require("../../assets/cards/hearts_8.png") },
  { id: "hearts_9", source: require("../../assets/cards/hearts_9.png") },
  { id: "hearts_10", source: require("../../assets/cards/hearts_10.png") },
  { id: "hearts_J", source: require("../../assets/cards/hearts_J.png") },
  { id: "hearts_Q", source: require("../../assets/cards/hearts_Q.png") },
  { id: "hearts_K", source: require("../../assets/cards/hearts_K.png") },
  { id: "hearts_A", source: require("../../assets/cards/hearts_A.png") },
  { id: "spades_2", source: require("../../assets/cards/spades_2.png") },
  { id: "spades_3", source: require("../../assets/cards/spades_3.png") },
  { id: "spades_4", source: require("../../assets/cards/spades_4.png") },
  { id: "spades_5", source: require("../../assets/cards/spades_5.png") },
  { id: "spades_6", source: require("../../assets/cards/spades_6.png") },
  { id: "spades_7", source: require("../../assets/cards/spades_7.png") },
  { id: "spades_8", source: require("../../assets/cards/spades_8.png") },
  { id: "spades_9", source: require("../../assets/cards/spades_9.png") },
  { id: "spades_10", source: require("../../assets/cards/spades_10.png") },
  { id: "spades_J", source: require("../../assets/cards/spades_J.png") },
  { id: "spades_Q", source: require("../../assets/cards/spades_Q.png") },
  { id: "spades_K", source: require("../../assets/cards/spades_K.png") },
  { id: "spades_A", source: require("../../assets/cards/spades_A.png") },
];

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const moveItem = (items: Card[], from: number, to: number) => {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const pickRandomCards = (count: number): Card[] => {
  const deck = [...fullDeck];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count);
};

const CardItem: React.FC<{
  card: Card;
  index: number;
  itemCount: number;
  onSwap: (from: number, to: number) => void;
}> = ({ card, index, itemCount, onSwap }) => {
  const translateX = useRef(new Animated.Value(index * CARD_SPACING)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const zIndex = useRef(new Animated.Value(0)).current;
  const isDragging = useRef(false);
  const startX = useRef(0);

  useEffect(() => {
    if (!isDragging.current) {
      Animated.spring(translateX, {
        toValue: index * CARD_SPACING,
        useNativeDriver: false,
      }).start();
    }
  }, [index, translateX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          isDragging.current = true;
          startX.current = index * CARD_SPACING;
          Animated.timing(zIndex, {
            toValue: 100,
            duration: 0,
            useNativeDriver: false, // zIndex doesn't support native driver
          }).start();

          Animated.spring(translateY, {
            toValue: -12,
            useNativeDriver: false,
          }).start();
        },
        onPanResponderMove: (_, gestureState) => {
          translateX.setValue(startX.current + gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          isDragging.current = false;
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false ,
          }).start();

          const finalX = startX.current + gestureState.dx;
          const newIndex = clamp(
            Math.round(finalX / CARD_SPACING),
            0,
            itemCount - 1,
          );

          if (newIndex !== index) {
            onSwap(index, newIndex);
          }
          Animated.timing(zIndex, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }).start();

          Animated.spring(translateX, {
            toValue: newIndex * CARD_SPACING,
            useNativeDriver: false,
          }).start();
        },
        onPanResponderTerminate: (_, gestureState) => {
          isDragging.current = false;
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          Animated.spring(translateX, {
            toValue: index * CARD_SPACING,
            useNativeDriver: false,
          }).start();
        },
      }),
    [index, itemCount, onSwap, translateX, translateY, zIndex],
  );

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ translateX }, { translateY }],
          zIndex: zIndex,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={card.source} style={styles.cardImage} />
    </Animated.View>
  );
};

const Cards: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(() => pickRandomCards(HAND_SIZE));

  const onSwap = useCallback((from: number, to: number) => {
    setCards((prev) => moveItem(prev, from, to));
  }, []);

  const containerWidth = useMemo(
    () => cards.length * CARD_SPACING - CARD_GAP,
    [cards.length],
  );

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      {cards.map((card, index) => (
        <CardItem
          key={card.id}
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
    alignSelf: "center"
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 4,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
});
