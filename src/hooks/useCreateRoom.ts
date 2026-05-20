// src/hooks/useCreateRoom.ts
import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { generateRoomCode } from "../utils/roomCode";

export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  const createRoom = async (user: User | null): Promise<any> => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return null;
    }

    setLoading(true);

    try {
      const roomCode = generateRoomCode();

      // 1. Create the game room
      const { data: room, error: roomError } = await supabase
        .from("game_rooms")
        .insert({
          room_code: roomCode,
          host_id: user.id,
          status: "waiting",
          current_players: 1,
          max_players: 4,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // 2. Add host as Player 1
      const { error: playerError } = await supabase
        .from("room_players")
        .insert({
          room_id: room.id,
          user_id: user.id,
          seat_number: 1,
          is_host: true,
        });

      if (playerError) throw playerError;

      setCreatedRoom(room);
      return room; // Return full room object
    } catch (error: any) {
      console.error("Create Room Error:", error);
      Alert.alert("Failed to create room", error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRoom,
    loading,
    createdRoom,
  };
};
