import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "@okoli/ui";
import { Section, Stack } from "./helpers/layout";
import { THEME_NAMES, themes } from "../src/themes";

const meta = {
  title: "Foundations/Colors",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Colours are named by role, not by hue, so a brand only swaps values. Components never use hex directly.",
          "",
          "```ts",
          'import { createTheme, lightTheme } from "@okoli/ui/theme";',
          "",
          "const ember = createTheme(lightTheme, {",
          '  colors: { primary: "#F97316", onPrimary: "#FFFFFF", secondary: "#431407" },',
          "  radius: { pill: 14 },",
          "});",
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function flatten(colors: Record<string, string | Record<string, string>>) {
  return Object.entries(colors).flatMap(([key, value]) =>
    typeof value === "string" ? [[key, value]] : Object.entries(value).map(([k, v]) => [`${key}.${k}`, v]),
  );
}

/** Every colour token of the active theme. */
export const Tokens: Story = {
  render: function Tokens() {
    const { theme } = useUnistyles();
    return (
      <Stack gap={8}>
        {flatten(theme.colors).map(([name, value]) => (
          <View key={name} style={styles.row}>
            <View style={[styles.swatch, { backgroundColor: value }]} />
            <Text weight="medium" style={{ flex: 1 }}>
              {name}
            </Text>
            <Text variant="captionL" tone="secondary">
              {value}
            </Text>
          </View>
        ))}
      </Stack>
    );
  },
};

/** All the example brands side by side: the same tokens, different values. */
export const Brands: Story = {
  render: () => (
    <Stack gap={16}>
      {THEME_NAMES.map((name) => {
        const t = themes[name];
        return (
          <View key={name} style={[styles.brand, { backgroundColor: t.colors.background, borderRadius: t.radius.xl }]}>
            <Text variant="captionL" weight="semiBold" style={{ color: t.colors.textSecondary }}>
              {name}
            </Text>
            <View style={[styles.fakeButton, { backgroundColor: t.colors.primary, borderRadius: t.radius.pill }]}>
              <Text weight="semiBold" style={{ color: t.colors.onPrimary }}>
                Primary
              </Text>
            </View>
            <View style={[styles.fakeButton, { backgroundColor: t.colors.secondary, borderRadius: t.radius.pill }]}>
              <Text weight="semiBold" style={{ color: t.colors.onSecondary }}>
                Secondary
              </Text>
            </View>
            <View style={styles.chips}>
              {(["surface", "text", "success", "warning", "danger", "info"] as const).map((k) => (
                <View key={k} style={[styles.chip, { backgroundColor: t.colors[k] }]} />
              ))}
            </View>
          </View>
        );
      })}
    </Stack>
  ),
};

/** The status colours with their soft fills and on-colours. */
export const Status: Story = {
  render: function Status() {
    const { theme } = useUnistyles();
    const keys = ["success", "warning", "danger", "info"] as const;
    return (
      <Stack>
        {keys.map((k) => {
          const on = theme.colors[`on${k[0].toUpperCase()}${k.slice(1)}` as `on${Capitalize<typeof k>}`];
          return (
            <Section key={k} title={k}>
              <View style={styles.statusRow}>
                <View style={[styles.statusBox, { backgroundColor: theme.colors[k] }]}>
                  <Text weight="semiBold" style={{ color: on }}>
                    {k}
                  </Text>
                </View>
                <View style={[styles.statusBox, { backgroundColor: theme.colors[`${k}Soft`] }]}>
                  <Text weight="semiBold" style={{ color: theme.colors[k] }}>
                    {k}Soft
                  </Text>
                </View>
              </View>
            </Section>
          );
        })}
      </Stack>
    );
  },
};

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.stroke.strong,
  },
  brand: { padding: theme.spacing.lg, gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.stroke.soft },
  fakeButton: { height: 40, alignItems: "center", justifyContent: "center" },
  chips: { flexDirection: "row", gap: 6, marginTop: 4 },
  chip: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" },
  statusRow: { flexDirection: "row", gap: theme.spacing.sm },
  statusBox: { flex: 1, height: 56, alignItems: "center", justifyContent: "center", borderRadius: theme.radius.md },
}));
