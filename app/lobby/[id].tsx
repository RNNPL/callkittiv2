import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";
import { AppButton } from "../../src/components/AppButton";
import UserContainer from "../../src/components/UserContainer";
import { useAuth } from "../../src/hooks/useAuth";
import { colors, radius } from "../../src/theme/tokens";

interface Player {
  id: string;
  name: string;
  isMe?: boolean;
  isHost?: boolean;
}

interface Room {
  id: string;
  room_code: string;
  current_players: number;
  max_players: number;
  status: string;
}

export default function LobbyScreen() {
  const { id } = useLocalSearchParams();
  const { user, loading: authLoading } = useAuth();

  const roomParam = String(id ?? "")
    .trim()
    .toUpperCase();

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const displayRoomCode = room?.room_code || roomParam || "----";

  // =========================
  // FETCH PLAYERS
  // =========================
  const fetchPlayers = async (roomId: string) => {
    const { data, error } = await supabase
      .from("room_players")
      .select("seat_number,is_host,user_id")
      .eq("room_id", roomId)
      .order("seat_number", { ascending: true });

    if (error) {
      console.log("Fetch players error:", error);
      return;
    }

    const formatted: Player[] =
      data?.map((p: any) => ({
        id: p.user_id,
        name: p.profiles?.username || `Player ${p.seat_number}`,
        isHost: p.is_host,
        isMe: p.user_id === user?.id,
      })) || [];

    setPlayers(formatted);
  };

  // =========================
  // LOAD ROOM
  // =========================
  const loadRoom = async () => {
    if (!roomParam) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("game_rooms")
      .select("id, room_code, current_players, max_players, status")
      .eq("room_code", roomParam)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setRoom(data);
    await fetchPlayers(data.id);

    setLoading(false);
  };

  useEffect(() => {
    loadRoom();
  }, [roomParam]);

  // =========================
  // REALTIME
  // =========================
  useEffect(() => {
    if (!room?.id) return;

    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_players",
          filter: `room_id=eq.${room.id}`,
        },
        () => fetchPlayers(room.id),
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          setRoom((prev) =>
            prev ? { ...prev, ...(payload.new as Partial<Room>) } : prev,
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

  // =========================
  // HOST CHECK
  // =========================
  const isHost = useMemo(() => {
    return players.some((p) => p.id === user?.id && p.isHost);
  }, [players, user?.id]);

  const checkIsHost = async (): Promise<boolean> => {
    if (!room?.id || !user?.id) return false;

    const { data } = await supabase
      .from("room_players")
      .select("is_host")
      .eq("room_id", room.id)
      .eq("user_id", user.id)
      .maybeSingle();

    return data?.is_host === true;
  };

  // =========================
  // LEAVE ROOM
  // =========================
  const leaveRoom = async () => {
    if (!room?.id || !user?.id) return;

    const { error } = await supabase
      .from("room_players")
      .delete()
      .eq("room_id", room.id)
      .eq("user_id", user.id);

    if (error) console.log(error);
  };

  // =========================
  // DELETE ROOM (HOST)
  // =========================
  const deleteRoom = async () => {
    if (!room?.id) return;

    await supabase.from("room_players").delete().eq("room_id", room.id);

    await supabase.from("game_rooms").delete().eq("id", room.id);
  };

  // =========================
  // HANDLE LEAVE
  // =========================
  const handleLeaveRoom = async () => {
    const host = await checkIsHost();

    if (host) {
      await deleteRoom();
    } else {
      await leaveRoom();
    }

    router.replace("/");
  };

  // =========================
  // START GAME
  // =========================
  const handleStartGame = () => {
    setIsStarting(true);
    router.push("/gamescreen/gamescreen");
  };

  // =========================
  // LOADING
  // =========================
  if (authLoading || loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading lobby...</Text>
      </View>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (notFound) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Room not found</Text>

        <AppButton label="Back Home" onPress={() => router.replace("/")} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <Stack.Screen options={{ title: `Lobby - ${displayRoomCode}` }} />

      {/* LEFT */}
      <View style={[isLandscape ? styles.leftCol : styles.fullWidth]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.label}>ROOM CODE</Text>
            <Text style={styles.codeText}>{displayRoomCode}</Text>
          </View>

          <View style={styles.statusCard}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.statusText}>
              {room?.status === "waiting"
                ? "Waiting for players"
                : room?.status}
            </Text>
            <Text style={styles.countText}>
              {players.length} / {room?.max_players}
            </Text>
          </View>

          {isLandscape && (
            <View style={styles.footerLandscape}>
              {isHost && (
                <AppButton
                  label={isStarting ? "Starting..." : "Start Game"}
                  onPress={handleStartGame}
                  disabled={players.length < 2 || isStarting}
                  style={styles.btn}
                />
              )}

              <AppButton
                label="Leave Room"
                variant="ghost"
                onPress={handleLeaveRoom}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* RIGHT */}
      <View style={styles.listWrapper}>
        <Text style={styles.listTitle}>Players Joined</Text>
        <UserContainer players={players} />
      </View>

      {!isLandscape && (
        <View style={styles.footer}>
          {isHost && (
            <AppButton
              label={isStarting ? "Starting..." : "Start Game"}
              onPress={handleStartGame}
              disabled={players.length < 2 || isStarting}
              style={styles.btn}
            />
          )}

          <AppButton
            label="Leave Room"
            variant="ghost"
            onPress={handleLeaveRoom}
          />
        </View>
      )}
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 60,
    paddingHorizontal: 24,
    marginTop: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  containerLandscape: {
    flexDirection: "row",
    gap: 24,
    paddingTop: 20,
  },

  fullWidth: {
    width: "100%",
  },

  leftCol: {
    flex: 0.8,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },

  codeText: {
    color: colors.white,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 8,
    textTransform: "uppercase",
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.bgInput,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  countText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "700",
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
    letterSpacing: 1,
    textTransform: "uppercase",
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

  loadingText: {
    marginTop: 16,
    color: colors.white,
  },

  errorText: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 20,
  },
});
