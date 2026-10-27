import { StyleSheet } from "react-native-unistyles";
import { themes } from "./themes";

export { themes } from "./themes";

type AppThemes = typeof themes;

declare module "react-native-unistyles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Unistyles' documented augmentation pattern
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes,
  settings: { initialTheme: "light" },
});
