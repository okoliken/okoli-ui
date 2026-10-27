import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Tappable, Text } from "@okoli/ui";
import { Section, Stack } from "./helpers/layout";
import { ChevronRight } from "./helpers/icons";

const meta = {
  title: "Components/Tappable",
  component: Tappable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A `Pressable` that answers the finger quietly: it dims while held and gives a light selection haptic. Use it for rows, cards and anything tappable that isn't a Button. It takes any `Pressable` prop.",
          "",
          "```tsx",
          "<Tappable onPress={open} style={styles.row}>",
          "  <Text>Statements</Text>",
          "</Tappable>",
          "```",
        ].join("\n"),
      },
    },
  },
  args: { haptic: true },
  argTypes: { onPress: { action: "pressed" } },
} satisfies Meta<typeof Tappable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Press and hold to see the dim. */
export const Row: Story = {
  render: (args) => (
    <Tappable {...args} style={styles.card}>
      <Text weight="semiBold">Press and hold</Text>
      <Text tone="secondary">Dims while pressed, light haptic</Text>
    </Tappable>
  ),
};

/** A settings list built from Tappable rows. */
export const SettingsList: Story = {
  render: function SettingsList() {
    const { theme } = useUnistyles();
    const items = [
      ["Personal details", "Name, phone, address"],
      ["Security", "PIN, Face ID"],
      ["Notifications", "Push and email"],
      ["Statements", "Download monthly PDFs"],
    ];
    return (
      <Stack>
        <View style={styles.list}>
          {items.map(([title, note], i) => (
            <Tappable key={title} style={[styles.listRow, i > 0 && styles.divider]}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text weight="semiBold">{title}</Text>
                <Text variant="captionL" tone="secondary">
                  {note}
                </Text>
              </View>
              <ChevronRight color={theme.colors.textTertiary} />
            </Tappable>
          ))}
        </View>
      </Stack>
    );
  },
};

/** Tappable cards in a grid, with haptics turned off. */
export const Tiles: Story = {
  render: () => (
    <Stack>
      <Section title="Quick actions" note="haptic={false}">
        <View style={styles.grid}>
          {["Send", "Request", "Top up", "Pay bills"].map((label) => (
            <Tappable key={label} haptic={false} style={styles.tile}>
              <Text weight="semiBold">{label}</Text>
            </Tappable>
          ))}
        </View>
      </Section>
    </Stack>
  ),
};

const styles = StyleSheet.create((theme) => ({
  card: { padding: theme.spacing.lg, gap: 4, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface },
  list: { borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, overflow: "hidden" },
  listRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.lg },
  divider: { borderTopWidth: 1, borderTopColor: theme.colors.stroke.soft },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md },
  tile: {
    width: "47%",
    height: 88,
    padding: theme.spacing.lg,
    justifyContent: "flex-end",
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
  },
}));
