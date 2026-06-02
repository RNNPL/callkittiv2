import { getCardImage } from "@/src/utils/cardImages";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Image, PanResponder, StyleSheet } from "react-native";
import {
  CARD_HEIGHT,
  CARD_SPACING,
  CARD_WIDTH,
  clamp,
  getCardPosition
} from "../../lib/viewCardHelper";
export const CardItem: React.FC<{
  card: string;
  index: number;
  itemCount: number;
  onSwap: (from: number, to: number) => void;
}> = ({ card, index, itemCount, onSwap }) => {
  const translateX = useRef(new Animated.Value(getCardPosition(index))).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const zIndex = useRef(new Animated.Value(0)).current;
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentDragIndex = useRef(index);
  const cardSource = getCardImage(card);

  useEffect(() => {
    if (!isDragging.current) {
      Animated.spring(translateX, {
        toValue: getCardPosition(index),
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    }
  }, [index, translateX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          isDragging.current = true;
          currentDragIndex.current = index;
          startX.current = getCardPosition(index);
          Animated.timing(zIndex, {
            toValue: 100,
            duration: 0,
            useNativeDriver: false,
          }).start();
          Animated.spring(translateY, {
            toValue: -12,
            useNativeDriver: false,
          }).start();
        },
        onPanResponderMove: (_, gestureState) => {
          translateX.setValue(startX.current + gestureState.dx);

          const currentX = startX.current + gestureState.dx;

          // Calculate target index based on actual card positions
          let targetIndex = currentDragIndex.current;
          for (let i = 0; i < itemCount; i++) {
            const cardPosition = getCardPosition(i);
            if (
              currentX > cardPosition - CARD_SPACING / 2 &&
              currentX < cardPosition + CARD_SPACING / 2
            ) {
              targetIndex = i;
              break;
            }
          }

          targetIndex = clamp(targetIndex, 0, itemCount - 1);

          if (targetIndex !== currentDragIndex.current) {
            onSwap(currentDragIndex.current, targetIndex);
            currentDragIndex.current = targetIndex;
            startX.current = getCardPosition(targetIndex);
          }
        },
        onPanResponderRelease: () => {
          isDragging.current = false;
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          Animated.timing(zIndex, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }).start();
          Animated.spring(translateX, {
            toValue: getCardPosition(index),
            useNativeDriver: false,
            friction: 8,
            tension: 40,
          }).start();
        },
        onPanResponderTerminate: () => {
          isDragging.current = false;
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          Animated.spring(translateX, {
            toValue: getCardPosition(index),
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
      <Image source={cardSource} style={styles.cardImage} />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
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
