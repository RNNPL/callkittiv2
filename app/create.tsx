import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../app/theme/tokens";
import { AppButton, Card, SectionLabel } from "../src/components/AppButton";
import { useRoom } from "./hooks/useroom";
import Users from "../src/components/Users"; // Ensure this path is correct

export default function CreateRoomScreen() {
  const { createdRoom, createRoom } = useRoom();

  // In a real app, 'players' should come from your useRoom hook 
  // or a socket listener. For now, we'll mock it:
  const joinedPlayers = [
    { id: "1", name: "You (Host)", isMe: true, isHost: true },
    // When someone joins via your backend, they'd appear here
  ];

  const handleCreate = async () => {
    try {
      const code = await createRoom();
      console.log("Room created with code:", code);
      // If you want to stay on this page to wait for people, 
      // do NOT call router.push immediately.
      // If you want to move to a dedicated lobby, keep it:
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

      {/* If the room is created, show the code and the list of people */}
      {!!createdRoom && (
        <View style={styles.lobbyArea}>
          <View style={styles.codeBox}>
            <SectionLabel text="Room Code" />
            <Text style={styles.codeText}>{createdRoom}</Text>
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listLabel}>Players Joined</Text>
            {/* Mapping the list using your Users component */}
            <Users players={joinedPlayers} />
          </View>
        </View>
      )}

      <View style={styles.footer}>
        {!createdRoom ? (
          <AppButton
            label="Generate Room"
            onPress={handleCreate}
            style={styles.btn}
          />
        ) : (
          <AppButton
            label="Enter Lobby"
            onPress={() => router.push(`/lobby/${createdRoom}` as any)}
            style={styles.btn}
          />
        )}

        <AppButton 
          label="← Back" 
          onPress={() => router.back()} 
          variant="ghost" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 60, // Adjust for status bar
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center'
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
    padding: 16, // Assuming your Card component needs padding
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
  lobbyArea: {
    flex: 1, // Takes up available space for the list
    width: '100%',
  },
  codeBox: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12
  },
  codeText: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.accent,
    letterSpacing: 6,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  listLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  footer: {
    width: '100%',
    paddingVertical: 20,
  },
  btn: {
    width: "100%",
    marginBottom: 12,
  },
});