import { supabase } from "@/lib/supabase";

export const getRoomPlayersData = async () => {
  const { data, error } = await supabase.from("room_players").select(`
      id,
      name,
      isMe,
      isHost
    `);
  if (error) {
    console.error("Error fetching room players data:", error);
    return [];
  } else {
    return data ;
  }
};
