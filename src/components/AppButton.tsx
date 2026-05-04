import React from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { colors, radius } from "../../app/theme/tokens";

type ButtonVariant = "primary" | "secondary" | "ghost";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  style,
}: PrimaryButtonProps) {
  const variantStyles: Record<
    ButtonVariant,
    { wrapper: ViewStyle; text: TextStyle }
  > = {
    primary: {
      wrapper: { backgroundColor: colors.accent },
      text: { color: "#052e16", fontWeight: "800" },
    },
    secondary: {
      wrapper: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: colors.accent,
      },
      text: { color: colors.accent, fontWeight: "700" },
    },
    ghost: {
      wrapper: { backgroundColor: "transparent" },
      text: { color: colors.muted, fontWeight: "500" },
    },
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.base, variantStyles[variant].wrapper, style]}
    >
      <Text style={[styles.label, variantStyles[variant].text]}>{label}</Text>
    </TouchableOpacity>
  );
}

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type SectionLabelProps = {
  text: string;
  style?: TextStyle;
};

export function SectionLabel({ text, style }: SectionLabelProps) {
  return <Text style={[styles.sectionLabel, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    fontWeight: "600",
  },
});
