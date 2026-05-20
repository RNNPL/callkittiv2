// lib/supabase.ts

import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const authOptions: any = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

// Only use React Native AsyncStorage when running on a native device.
// On web or during server-side build, leave storage undefined so Supabase
// falls back to its browser storage implementation.
if (typeof window !== "undefined" && Platform.OS !== "web") {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  authOptions.storage = AsyncStorage;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authOptions,
});
