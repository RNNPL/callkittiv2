import { useState } from "react";

// Define the shape of our hook's return value
interface UseRoomReturn {
  roomCode: string;
  setRoomCode: (code: string) => void;
  createdRoom: string;
  createRoom: () => Promise<string>;
  loading: boolean;
}

export const useRoom = (): UseRoomReturn => {
  const [roomCode, setRoomCode] = useState<string>("");
  
  const [createdRoom, setCreatedRoom] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(false);


  const createRoom = async (): Promise<string> => {
    setLoading(true);
    
    try {
     
      await new Promise((resolve) => setTimeout(resolve, 1000));


      const newCode = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();

      setCreatedRoom(newCode);
      return newCode;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    roomCode,
    setRoomCode,
    createdRoom,
    createRoom,
    loading,
  };
};