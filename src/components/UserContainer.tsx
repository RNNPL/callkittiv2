import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../theme/tokens";

interface Player {
  id: string;
  name: string;
  isMe?: boolean;
  isHost?: boolean;
}

interface UsersProps {
  players: Player[];
}

const MAX_PLAYERS = 4;

export default function UserContainer({ players }: UsersProps) {
  const positions = ["Top", "Left", "Right", "Bottom"];

  // Pad array with empty slots up to MAX_PLAYERS
  const paddedPlayers = [
    ...players,
    ...Array(MAX_PLAYERS - players.length).fill(null),
  ];

  const renderPlayerSlot = (
    player: Player | null,
    position: string,
    index: number,
  ) => {
    return (
      <View key={`${position}-${index}`} style={styles.playerSlot}>
        <View style={[styles.playerBox, !player && styles.emptySlot]}>
          {player ? (
            <>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: player.isMe ? colors.accent : colors.muted,
                  },
                ]}
              />
              <Text
                style={[styles.playerText, player.isMe && styles.myPlayerText]}
              >
                {player.name || `Player ${index + 1}`}
              </Text>
              {player.isHost && (
                <View style={styles.hostBadge}>
                  <Text style={styles.hostText}>HOST</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>{position}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {paddedPlayers.map((player, index) =>
          renderPlayerSlot(player, positions[index], index),
        )}
      </View>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {players.length} / {MAX_PLAYERS}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 12,
  },
  playerSlot: {
    width: "48%",
    minHeight: 80,
  },
  playerBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: radius.md,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  emptySlot: {
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  playerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  myPlayerText: {
    color: colors.accent,
    fontWeight: "bold",
  },
  hostBadge: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  hostText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "bold",
  },
  emptyText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "500",
  },
  countContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  countText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "bold",
  },
});
