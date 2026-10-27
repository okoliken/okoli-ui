import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "@okoli/ui";

/** Scrollable column for stories with many examples. */
export function Stack({ children, gap = 12 }: { children: React.ReactNode; gap?: number }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.stack, { gap }]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

/** A labelled group inside a story. */
export function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text variant="captionL" weight="semiBold" tone="secondary" style={styles.title}>
          {title}
        </Text>
        {note ? (
          <Text variant="captionL" tone="tertiary">
            {note}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Children side by side, wrapping. */
export function Row({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) {
  return <View style={[styles.row, { gap }]}>{children}</View>;
}

/** A surface card to place examples on. */
export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create((theme) => ({
  scroll: { flex: 1 },
  stack: { paddingBottom: theme.spacing.xxxl },
  section: { gap: theme.spacing.sm },
  heading: { gap: 2 },
  title: { textTransform: "uppercase", letterSpacing: 0.6 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  card: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
  },
}));
