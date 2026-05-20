// app/_layout.tsx
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { colors } from "../src/theme/tokens";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/hooks/useAuth";

export default function Layout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user || loading) return;

    const ensureProfile = async () => {
      try {
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            username: `Player_${user.id.slice(0, 8)}`,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        );

        if (error) {
          console.error("Profile upsert error:", error.message);
        } else {
          console.log("✅ Profile ensured for:", user.id);
        }
      } catch (err) {
        console.error("Unexpected error ensuring profile:", err);
      }
    };

    ensureProfile();
  }, [user, loading]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 180,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </View>
  );
}
