import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Props {
  name: string;
}

const PlayerIcon: React.FC<Props> = ({ name }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/cards/spades_K.png")}
        style={styles.image}
      />
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

export default PlayerIcon;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  text: {
    color: "#000",
    marginTop: 4,
  },
});