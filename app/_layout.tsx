import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { colors } from "./theme/tokens";

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 180,

          contentStyle: {
            backgroundColor: colors.bg,
          },
        }}
      />
    </View>
  );
}
