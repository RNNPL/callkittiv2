// app/create-room.tsx  (or wherever this screen is)
import { useAuth } from "@/src/hooks/useAuth";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, Card, SectionLabel } from "../src/components/AppButton";
import Users, { Player } from "../src/components/Users";
import { useCreateRoom } from "../src/hooks/useCreateRoom"; // ← Use correct hook
import { colors } from "../src/theme/tokens";
import { supabase } from "@/lib/supabase";

export default function CreateRoomScreen() {
  const { user, loading: authLoading } = useAuth();
  const { createRoom, loading: creating } = useCreateRoom();

  const [createdRoomId, setCreatedRoomId] = React.useState<string | null>(null);
  const [roomCode, setRoomCode] = React.useState<string | null>(null);
  const [players, setPlayers] = React.useState<Player[]>([]);

  const handleCreateRoom = async () => {
    if (!user) {
      alert("Please wait while we set up your account...");
      return;
    }

    const room = await createRoom(user);

    if (room) {
      setCreatedRoomId(room.id);
      setRoomCode(room.room_code);

      // Add host as Player 1
      setPlayers([
        {
          id: user.id,
          name: "You (Host)",
          isMe: true,
          isHost: true,
        },
      ]);

      // Navigate to lobby with room code
      router.push(`/lobby/${room.room_code}`);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Host a Room</Text>
      <Text style={styles.subheading}>Share the code with your friends</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Private Game Room</Text>
        <Text style={styles.cardBody}>
          A unique 6-digit code will be generated for others to join.
        </Text>
      </Card>

      {/* Show room info after creation */}
      {createdRoomId && roomCode && (
        <View style={styles.lobbyArea}>
          <View style={styles.codeBox}>
            <SectionLabel text="ROOM CODE" />
            <Text style={styles.codeText}>{roomCode}</Text>
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listLabel}>PLAYERS JOINED</Text>
            <Users players={players} />
          </View>
        </View>
      )}

      <View style={styles.footer}>
        {!createdRoomId ? (
          <AppButton
            label={creating ? "Creating Room..." : "Generate Room"}
            onPress={handleCreateRoom}
            disabled={creating}
            style={styles.btn}
          />
        ) : (
          <AppButton
            label="Go to Lobby"
            onPress={handleCreateRoom}
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
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 8,
    textAlign: "center",
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
  lobbyArea: {
    flex: 1,
    width: "100%",
  },
  codeBox: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 12,
  },
  codeText: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.accent,
    letterSpacing: 8,
    marginTop: 8,
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  listLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  footer: {
    width: "100%",
    paddingVertical: 20,
  },
  btn: {
    width: "100%",
    marginBottom: 12,
  },
});
