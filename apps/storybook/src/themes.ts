import { createTheme, darkTheme, lightTheme } from "@okoli/ui/theme";

/**
 * Example brand presets: the same components rebranded through tokens alone. Each one changes
 * colours, and some change the shape too (radius), to show how far a theme can move the kit.
 */
const payra = createTheme(lightTheme, {
  name: "payra",
  colors: {
    background: "#F3F4F6",
    primary: "#ECF0AF",
    onPrimary: "#0B4647",
    secondary: "#0B4647",
    onSecondary: "#FFFFFF",
  },
});

/** Food delivery: warm orange, cream background, slightly squarer buttons. */
const ember = createTheme(lightTheme, {
  name: "ember",
  colors: {
    background: "#FFF8F1",
    surfaceRaised: "#FFFDFB",
    primary: "#F97316",
    onPrimary: "#FFFFFF",
    secondary: "#431407",
    onSecondary: "#FFEDD5",
  },
  radius: { pill: 14, sheet: 24 },
});

/** Social / creator app: violet with a soft lilac canvas. */
const grape = createTheme(lightTheme, {
  name: "grape",
  colors: {
    background: "#F6F3FF",
    primary: "#7C3AED",
    onPrimary: "#FFFFFF",
    secondary: "#2E1065",
    onSecondary: "#EDE9FE",
  },
});

/** Banking: deep navy and calm blue, square-ish corners everywhere. */
const ocean = createTheme(darkTheme, {
  name: "ocean",
  colors: {
    background: "#0B1220",
    surface: "#111A2E",
    surfaceRaised: "#16213A",
    field: "#1A2742",
    primary: "#38BDF8",
    onPrimary: "#0B1220",
    secondary: "#E0F2FE",
    onSecondary: "#0B1220",
  },
  radius: { sm: 6, md: 8, lg: 10, xl: 12, xxl: 14, sheet: 16, pill: 10 },
});

export const themes = { light: lightTheme, dark: darkTheme, payra, ember, grape, ocean };
export type ThemeName = keyof typeof themes;
export const THEME_NAMES = Object.keys(themes) as ThemeName[];
