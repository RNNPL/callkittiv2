import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, Card, SectionLabel } from "../../src/components/AppButton";
import { colors } from "../theme/tokens";
import { useRoom } from "./../hooks/Useroom";

export default function CreateRoomScreen() {
  const { createdRoom, createRoom } = useRoom();

  const handleCreate = async () => {
    try {
      const code = await createRoom();

      if (code) {
        router.push(`/lobby/${code}` as any);
      }
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Host a Room</Text>
      <Text style={styles.subheading}>Share the code and start instantly.</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Your private room</Text>
        <Text style={styles.cardBody}>
          A unique room code will be generated for players to join.
        </Text>
      </Card>

      {!!createdRoom && (
        <View style={styles.codeBox}>
          <SectionLabel text="Room Code" />
          <Text style={styles.codeText}>{createdRoom}</Text>
        </View>
      )}

      <AppButton label="Start Room" onPress={handleCreate} style={styles.btn} />

      <AppButton label="← Back" onPress={() => router.back()} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    width: "100%",
    marginBottom: 20,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  cardBody: {
    color: colors.muted,
    marginTop: 6,
  },
  codeBox: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  codeText: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.accent,
    letterSpacing: 6,
  },
  btn: {
    width: "100%",
    marginBottom: 12,
  },
});
