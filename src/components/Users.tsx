import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { colors, radius } from "../../app/theme/tokens";

interface Player {
  id: string;
  name: string;
  isMe?: boolean;
  isHost?: boolean;
}

interface UsersProps {
  players: Player[];
}

export default function Users({ players }: UsersProps) {
  const renderItem = ({ item }: { item: Player }) => (
    <View style={styles.playerRow}>
      <View
        style={[
          styles.dot,
          { backgroundColor: item.isMe ? colors.accent : colors.muted },
        ]}
      />
      <Text style={[styles.playerName, item.isMe && styles.myPlayerName]}>
        {item.name}
      </Text>
      {item.isHost && (
        <View style={styles.hostBadge}>
          <Text style={styles.hostText}>HOST</Text>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={players}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      // Troubleshooting: If this shows, the data isn't reaching the component
      ListEmptyComponent={
        <Text style={styles.emptyText}>No players found in list...</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  playerName: {
    color: colors.white,
    fontSize: 16,
    flex: 1,
  },
  myPlayerName: {
    color: colors.accent,
    fontWeight: "bold",
  },
  hostBadge: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hostText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "bold",
  },
  emptyText: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 20,
  },
});