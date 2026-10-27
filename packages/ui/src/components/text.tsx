import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type TextVariant = "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "bodyL" | "body" | "captionL" | "captionS";
export type TextWeight = "regular" | "medium" | "semiBold" | "bold";
export type TextTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "onPrimary"
  | "onSecondary"
  | "danger"
  | "success"
  | "warning";

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  weight?: TextWeight;
  tone?: TextTone;
  align?: "left" | "center" | "right";
};

/**
 * All text in the kit. Picks size from the theme's type scale (`variant`), the font for each
 * `weight`, and a colour by role (`tone`). Follows the system text size, capped at 1.35x.
 */
export function Text({ variant = "body", weight = "regular", tone = "primary", align = "left", style, ...rest }: TextProps) {
  styles.useVariants({ variant, weight, tone, align });
  // Follows the system text size (Dynamic Type), capped so fixed layouts still hold.
  return <RNText maxFontSizeMultiplier={1.35} style={[styles.text, style]} {...rest} />;
}

const styles = StyleSheet.create((theme) => ({
  text: {
    variants: {
      variant: {
        display: theme.typography.display,
        h1: theme.typography.h1,
        h2: theme.typography.h2,
        h3: theme.typography.h3,
        h4: theme.typography.h4,
        h5: theme.typography.h5,
        bodyL: theme.typography.bodyL,
        body: theme.typography.body,
        captionL: theme.typography.captionL,
        captionS: theme.typography.captionS,
      },
      weight: {
        regular: theme.fonts.regular,
        medium: theme.fonts.medium,
        semiBold: theme.fonts.semiBold,
        bold: theme.fonts.bold,
      },
      tone: {
        primary: { color: theme.colors.text },
        secondary: { color: theme.colors.textSecondary },
        tertiary: { color: theme.colors.textTertiary },
        onPrimary: { color: theme.colors.onPrimary },
        onSecondary: { color: theme.colors.onSecondary },
        danger: { color: theme.colors.danger },
        success: { color: theme.colors.success },
        warning: { color: theme.colors.warning },
      },
      align: {
        left: { textAlign: "left" },
        center: { textAlign: "center" },
        right: { textAlign: "right" },
      },
    },
  },
}));
