// Themes must be registered before any @okoli/ui stylesheet is created.
import "../src/unistyles";
import { useLayoutEffect } from "react";
import { View } from "react-native";
import type { Decorator, Preview } from "@storybook/react-native-web-vite";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { THEME_NAMES, themes, type ThemeName } from "../src/themes";

/** Applies the theme picked in the toolbar and frames each story at phone width. */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? "light") as ThemeName;
  if (UnistylesRuntime.themeName !== theme) UnistylesRuntime.setTheme(theme);
  const isStory = context.viewMode === "story";
  useLayoutEffect(() => {
    UnistylesRuntime.setTheme(theme);
    // In single-story view the whole canvas takes the theme's background; docs pages stay white.
    document.body.style.backgroundColor = isStory ? themes[theme].colors.background : "";
  }, [theme, isStory]);
  return (
    <View style={[styles.frame, isStory && styles.fullHeight]}>
      <Story />
    </View>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: THEME_NAMES.map((name) => ({ value: name, title: name })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: { order: ["Introduction", "Foundations", "Components"] },
    },
  },
};

const styles = StyleSheet.create((theme) => ({
  frame: {
    width: "100%",
    maxWidth: 430,
    minHeight: 120,
    marginHorizontal: "auto",
    padding: theme.spacing.gutter,
    backgroundColor: theme.colors.background,
  },
  fullHeight: { minHeight: "100vh" },
}));

export default preview;
