import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "@okoli/ui";
import { Stack } from "./helpers/layout";

const meta = {
  title: "Foundations/Spacing & Radius",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Spacing and corner radius come from the theme too. Use them in your own stylesheets so screens stay on the same rhythm as the kit:",
          "",
          "```ts",
          "const styles = StyleSheet.create((theme) => ({",
          "  card: { padding: theme.spacing.lg, borderRadius: theme.radius.xl },",
          "}));",
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The spacing scale; `gutter` is the horizontal page margin. */
export const Spacing: Story = {
  render: function Spacing() {
    const { theme } = useUnistyles();
    return (
      <Stack gap={10}>
        {Object.entries(theme.spacing).map(([name, value]) => (
          <View key={name} style={styles.row}>
            <Text weight="medium" style={styles.label}>
              {name}
            </Text>
            <View style={[styles.bar, { width: value * 4 }]} />
            <Text variant="captionL" tone="secondary">
              {value}
            </Text>
          </View>
        ))}
      </Stack>
    );
  },
};

/** The radius scale. Switch to the ember or ocean theme to see brands reshape it. */
export const Radius: Story = {
  render: function Radius() {
    const { theme } = useUnistyles();
    return (
      <Stack>
        <View style={styles.grid}>
          {Object.entries(theme.radius).map(([name, value]) => (
            <View key={name} style={styles.cell}>
              <View style={[styles.box, { borderRadius: Math.min(value, 36) }]} />
              <Text weight="medium">{name}</Text>
              <Text variant="captionL" tone="secondary">
                {value}
              </Text>
            </View>
          ))}
        </View>
      </Stack>
    );
  },
};

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  label: { width: 64 },
  bar: { height: 16, borderRadius: 4, backgroundColor: theme.colors.secondary },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.lg },
  cell: { width: "28%", gap: 4 },
  box: { width: 72, height: 72, backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.secondary },
}));
