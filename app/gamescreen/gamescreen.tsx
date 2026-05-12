import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import PlayerIcon from "./playericons";
import Cards from "./cards";

import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const GameScreen: React.FC = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      NavigationBar.setVisibilityAsync("hidden");
      // NavigationBar.setBehaviorAsync("overlay-swipe"); // Removed due to edge-to-edge incompatibility

      return () => {
        NavigationBar.setVisibilityAsync("visible");
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.iconText}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("" as never)}
      >
        <Text style={styles.iconText}>⚙️</Text>
      </TouchableOpacity>
      <StatusBar hidden />
      <View style={styles.table}>
        {/* Top Player */}
        <View style={[styles.player, styles.top]}>
          <PlayerIcon name="Player X" />
        </View>

        {/* Left Player */}
        <View style={[styles.player, styles.left]}>
          <PlayerIcon name="Player X" />
        </View>

        {/* Right Player */}
        <View style={[styles.player, styles.right]}>
          <PlayerIcon name="Player X" />
        </View>

        {/* Bottom Player */}
        <View style={[styles.player, styles.bottom]}>
          <PlayerIcon name="Player X" />
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <Cards />
        </View>
      </View>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b6b3a",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    width: width * 1,
    height: height * 0.8,
    backgroundColor: "#10b261",
    borderRadius: 200, 
    borderWidth: 20,
    borderColor:"#7a4a00",
    position: "relative",
  },

  player: {
    position: "absolute",
  },

  top: {
    top: -40,
    alignSelf: "center",
  },

  bottom: {
    bottom: -60,
    alignSelf: "center",
  },

  left: {
    left: -50,
    top: "50%",
    transform: [{ translateY: -30 }],
  },

  right: {
    right: -50,
    top: "50%",
    transform: [{ translateY: -30 }],
  },

  cardsContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 8,
  },

  settingsButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 8,
  },

  iconText: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
  },
});
