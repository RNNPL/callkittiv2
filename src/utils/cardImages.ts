// utils/cardImages.ts
const cardImageMap: { [key: string]: any } = {
  // === HEARTS ===
  AH: require("../../assets/cards/hearts_A.png"),
  "2H": require("../../assets/cards/hearts_2.png"),
  "3H": require("../../assets/cards/hearts_3.png"),
  "4H": require("../../assets/cards/hearts_4.png"),
  "5H": require("../../assets/cards/hearts_5.png"),
  "6H": require("../../assets/cards/hearts_6.png"),
  "7H": require("../../assets/cards/hearts_7.png"),
  "8H": require("../../assets/cards/hearts_8.png"),
  "9H": require("../../assets/cards/hearts_9.png"),
  "10H": require("../../assets/cards/hearts_10.png"),
  JH: require("../../assets/cards/hearts_J.png"),
  QH: require("../../assets/cards/hearts_Q.png"),
  KH: require("../../assets/cards/hearts_K.png"),

  // === DIAMONDS ===
  AD: require("../../assets/cards/diamonds_A.png"),
  "2D": require("../../assets/cards/diamonds_2.png"),
  "3D": require("../../assets/cards/diamonds_3.png"),
  "4D": require("../../assets/cards/diamonds_4.png"),
  "5D": require("../../assets/cards/diamonds_5.png"),
  "6D": require("../../assets/cards/diamonds_6.png"),
  "7D": require("../../assets/cards/diamonds_7.png"),
  "8D": require("../../assets/cards/diamonds_8.png"),
  "9D": require("../../assets/cards/diamonds_9.png"),
  "10D": require("../../assets/cards/diamonds_10.png"),
  JD: require("../../assets/cards/diamonds_J.png"),
  QD: require("../../assets/cards/diamonds_Q.png"),
  KD: require("../../assets/cards/diamonds_K.png"),

  // === CLUBS ===
  AC: require("../../assets/cards/clubs_A.png"),
  "2C": require("../../assets/cards/clubs_2.png"),
  "3C": require("../../assets/cards/clubs_3.png"),
  "4C": require("../../assets/cards/clubs_4.png"),
  "5C": require("../../assets/cards/clubs_5.png"),
  "6C": require("../../assets/cards/clubs_6.png"),
  "7C": require("../../assets/cards/clubs_7.png"),
  "8C": require("../../assets/cards/clubs_8.png"),
  "9C": require("../../assets/cards/clubs_9.png"),
  "10C": require("../../assets/cards/clubs_10.png"),
  JC: require("../../assets/cards/clubs_J.png"),
  QC: require("../../assets/cards/clubs_Q.png"),
  KC: require("../../assets/cards/clubs_K.png"),

  // === SPADES ===
  AS: require("../../assets/cards/spades_A.png"),
  "2S": require("../../assets/cards/spades_2.png"),
  "3S": require("../../assets/cards/spades_3.png"),
  "4S": require("../../assets/cards/spades_4.png"),
  "5S": require("../../assets/cards/spades_5.png"),
  "6S": require("../../assets/cards/spades_6.png"),
  "7S": require("../../assets/cards/spades_7.png"),
  "8S": require("../../assets/cards/spades_8.png"),
  "9S": require("../../assets/cards/spades_9.png"),
  "10S": require("../../assets/cards/spades_10.png"),
  JS: require("../../assets/cards/spades_J.png"),
  QS: require("../../assets/cards/spades_Q.png"),
  KS: require("../../assets/cards/spades_K.png"),
};

// Helper function
export const getCardImage = (cardCode: string) => {
  return cardImageMap[cardCode]; // fallback
};
