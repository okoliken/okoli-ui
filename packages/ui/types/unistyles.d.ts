// Typechecking only (not published): apps register their own themes, which extend OkoliTheme.
import type { OkoliTheme } from "../src/theme/tokens";

declare module "react-native-unistyles" {
  export interface UnistylesThemes {
    light: OkoliTheme;
    dark: OkoliTheme;
  }
}
