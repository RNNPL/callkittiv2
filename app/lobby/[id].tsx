import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { AppButton } from "../../src/components/AppButton";
import Users from "../../src/components/Users";
import { colors, radius } from "../theme/tokens";

export default function LobbyScreen() {
  const { id } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [players] = useState([
    { id: "1", name: "You (Host)", isMe: true, isHost: true },
    { id: "2", name: "Slayer_99", isMe: false, isHost: false },
    { id: "3", name: "PizzaGuy", isMe: false, isHost: false },
    { id: "4", name: "React_Native_Pro", isMe: false, isHost: false },
  ]);

  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = () => {
    setIsStarting(true);
   router.push(`../gamescreen/gamescreen` as any)

  };

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      
      {/* Left Column (Header + Status + Buttons in Landscape) */}
      <View style={[isLandscape ? styles.leftCol : styles.fullWidth]}>
        <ScrollView 
          contentContainerStyle={isLandscape ? styles.scrollContentLandscape : null}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.label}>ROOM CODE</Text>
            <Text style={[styles.codeText, isLandscape && styles.codeTextLandscape]}>
              {id || "----"}
            </Text>
          </View>

          {/* Status Bar */}
          <View style={styles.statusCard}>
            <ActivityIndicator color={colors.accent} size="small" />
            <Text style={styles.statusText}>Waiting...</Text>
            <Text style={styles.countText}>{players.length} / 8</Text>
          </View>

          {/* Buttons - Hidden here in portrait, shown here in landscape */}
          {isLandscape && (
            <View style={styles.footerLandscape}>
              <AppButton
                label={isStarting ? "Starting..." : "Start Game"}
                onPress={handleStartGame}
                disabled={players.length < 2 || isStarting}
                style={styles.btn}
              />
              <AppButton
                label="Leave Room"
                variant="ghost"
                onPress={() => router.replace("/")}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Right Column (Player List) */}
      <View style={styles.listWrapper}>
        <Text style={styles.listTitle}>Players Joined</Text>
        <Users players={players} />
      </View>

      {/* Footer (Shown only in Portrait at the bottom) */}
      {!isLandscape && (
        <View style={styles.footer}>
          <AppButton
            label={isStarting ? "Starting..." : "Start Game"}
            onPress={handleStartGame}
            disabled={players.length < 2 || isStarting}
            style={styles.btn}
          />
          <AppButton
            label="Leave Room"
            variant="ghost"
            onPress={() => router.replace("/")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 60,
    paddingHorizontal: 24,
    marginTop:50
  },
  containerLandscape: {
    flexDirection: "row", // Side-by-side layout
    paddingTop: 20,
    gap: 24,
  },
  fullWidth: {
    width: "100%",
  },
  leftCol: {
    flex: 0.8, // Header and buttons take up 40% of width
    justifyContent: "center",
  },
  scrollContentLandscape: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  codeText: {
    color: colors.white,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 8,
    textTransform: "uppercase",
  },
  codeTextLandscape: {
    fontSize: 32, // Shrink text size for landscape
    letterSpacing: 4,
  },
  statusCard: {
    flexDirection: "row",
    backgroundColor: colors.bgInput,
    padding: 16,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 24,
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  countText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "bold",
  },
  listWrapper: {
    flex: 1,
    marginBottom: 20,
  },
  listTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 40,
  },
  footerLandscape: {
    marginTop: "auto",
  },
  btn: {
    marginBottom: 12,
  },
});