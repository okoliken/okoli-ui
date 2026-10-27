import { ScrollView, View } from "react-native";
import type { Preview } from "@storybook/react-native";
import { StyleSheet, UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { Tappable, Text } from "@okoli/ui";
import { THEME_NAMES } from "../src/themes";

/** Theme pills above every story, so each component can be checked in every theme and brand preset. */
function ThemeBar() {
  const { rt } = useUnistyles();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.barScroll} contentContainerStyle={styles.bar}>
      {THEME_NAMES.map((name) => {
        const active = rt.themeName === name;
        return (
          <Tappable
            key={name}
            haptic={false}
            accessibilityState={{ selected: active }}
            onPress={() => UnistylesRuntime.setTheme(name)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text variant="captionL" weight="semiBold" tone={active ? "onSecondary" : "secondary"}>
              {name}
            </Text>
          </Tappable>
        );
      })}
    </ScrollView>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={styles.canvas}>
        <ThemeBar />
        <View style={styles.story}>
          <Story />
        </View>
      </View>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
};

const styles = StyleSheet.create((theme) => ({
  // Phone width in the browser, so components read as they will on a device.
  canvas: { flex: 1, width: "100%", maxWidth: 430, alignSelf: "center", backgroundColor: theme.colors.background },
  barScroll: { flexGrow: 0 },
  bar: { gap: theme.spacing.sm, padding: theme.spacing.gutter },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.fill.soft,
  },
  pillActive: { backgroundColor: theme.colors.secondary },
  story: { flex: 1, paddingHorizontal: theme.spacing.gutter },
}));

export default preview;
