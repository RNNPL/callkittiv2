import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton, SectionLabel } from "../src/components/AppButton";
import { useRoom } from "./hooks/useroom";
import { colors, radius } from "./theme/tokens";
import * as Network from "expo-network";

export default function JoinRoomScreen() {
  // Ensure useRoom provides a default empty string to avoid .trim() errors
  const { roomCode, setRoomCode } = useRoom();

  const handleJoin = async () => {
    const code = roomCode.trim().toUpperCase();

    if (!code || code.length < 4) {
      Alert.alert(
        "Invalid Room Code",
        "Please enter a valid room code (at least 4 characters).",
      );
      var ip = await Network.getIpAddressAsync();
      console.log("Device IP Address:", ip);
      return;
    }

    // The 'as any' bypasses the strict route check
    router.push(`/lobby/${code}` as any);
  };

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
          // Added to improve UX on mobile
          returnKeyType="join"
          onSubmitEditing={handleJoin}
          style={styles.input}
        />
      </View>

      <AppButton
        label="Join Room"
        onPress={handleJoin}
        variant="secondary"
        style={styles.btn}
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
  inputWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.bgInput,
    color: colors.white,
    padding: 16,
    borderRadius: radius.md,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btn: {
    width: "100%",
    marginBottom: 12,
  },
});
