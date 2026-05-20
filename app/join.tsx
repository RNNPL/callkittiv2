// app/join-room.tsx   (or wherever your Join Room screen is)
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// import { useAuth } from "../src/hooks/useAuth";
import { useAuth } from "@/src/hooks/useAuth";
import { AppButton, SectionLabel } from "../src/components/AppButton";
import { useJoinRoom } from "../src/hooks/useJoinRoom";
import { colors, radius } from "../src/theme/tokens";

export default function JoinRoomScreen() {
  // const { user, loading: authLoading } = useAuth();
  const { joinRoom, loading: joining } = useJoinRoom();

  const [roomCode, setRoomCode] = useState("");
  const { user, loading } = useAuth();
  const handleJoin = async () => {
    if (!user) {
      Alert.alert("Please wait", "Setting up your account...");
      return;
    }

    const code = roomCode.trim().toUpperCase();

    if (!code || code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a valid 6-digit room code.");
      return;
    }

    const room = await joinRoom(code, user);

    if (room) {
      // Navigate to lobby with room ID
      router.push(`/lobby/${room.room_code}` as any);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ marginTop: 16, color: colors.white }}>
          Setting up your account...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Join a Room</Text>
      <Text style={styles.subheading}>Enter the code shared by your host.</Text>

      <View style={styles.inputWrapper}>
        <SectionLabel text="Room Code" />

        <TextInput
          placeholder="ENTER CODE"
          placeholderTextColor={colors.muted}
          value={roomCode}
          onChangeText={setRoomCode}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          returnKeyType="join"
          onSubmitEditing={handleJoin}
          style={styles.input}
        />
      </View>

      <AppButton
        label={joining ? "Joining..." : "Join Room"}
        onPress={handleJoin}
        variant="secondary"
        style={styles.btn}
        disabled={joining}
      />

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
  },
  subheading: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 32,
    textAlign: "center",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.bgInput,
    color: colors.white,
    padding: 16,
    borderRadius: radius.md,
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btn: {
    width: "100%",
    marginBottom: 12,
  },
});
