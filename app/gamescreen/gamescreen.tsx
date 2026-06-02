import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BiddingButtonPopUp from "../../src/components/BiddingButtonPopUp";
import { colors } from "../../src/theme/tokens";
import Cards from "./cards";
import PlayerIcon from "./playericons";

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
      <BiddingButtonPopUp style={styles.biddingButton} />

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
    backgroundColor: "#52eb34",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    width: width * 1,
    height: height * 0.8,
    backgroundColor: colors.accentDark,
    borderRadius: 200,
    borderWidth: 20,
    borderColor: "#7a4a00",
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

  biddingButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    zIndex: 999,
  },
});
