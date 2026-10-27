import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, View, type ViewStyle } from "react-native";
import type { OkoliColors } from "../theme/tokens";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import { useGuardedPress } from "../hooks/use-guarded-press";
import { Text, type TextTone } from "./text";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "soft";
export type ButtonSize = "lg" | "md" | "sm";
/** `brand` follows the theme's primary/secondary; the rest use the status colours. */
export type ButtonColor = "brand" | "success" | "warning" | "danger" | "info";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  /** How the button is drawn: solid (primary/secondary), outline, soft fill or bare text. */
  variant?: ButtonVariant;
  /** Which palette it is drawn in. Defaults to the brand. */
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  /** Rendered after the label, e.g. an icon. */
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  fullWidth?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
};

const LABEL_TONE: Record<ButtonVariant, TextTone> = {
  primary: "onPrimary",
  secondary: "onSecondary",
  outline: "primary",
  ghost: "primary",
  soft: "primary",
};

/** Background, border and label colours for a status colour in each variant. */
function statusColors(colors: OkoliColors, color: Exclude<ButtonColor, "brand">, variant: ButtonVariant) {
  const solid = colors[color];
  const on = colors[`on${color[0].toUpperCase()}${color.slice(1)}` as `on${Capitalize<typeof color>}`];
  switch (variant) {
    case "primary":
    case "secondary":
      return { box: { backgroundColor: solid }, label: on };
    case "outline":
      return { box: { backgroundColor: "transparent", borderColor: solid }, label: solid };
    case "soft":
      return { box: { backgroundColor: colors[`${color}Soft`] }, label: solid };
    case "ghost":
      return { box: null, label: solid };
  }
}

/**
 * The kit's main action. Pill-shaped (follows `radius.pill`), 48 / 40 / 32pt tall, with a light
 * haptic on press and a 500ms double-tap guard so a quick double tap never submits twice.
 */
export function Button({
  title,
  variant = "primary",
  color = "brand",
  size = "lg",
  loading = false,
  icon,
  iconLeft,
  fullWidth = true,
  haptic = true,
  disabled,
  onPress,
  style,
  ...rest
}: ButtonProps) {
  const { theme } = useUnistyles();
  const isDisabled = !!disabled || loading;
  styles.useVariants({ variant, size, fullWidth, disabled: isDisabled });

  // Double taps fire onPress twice; only the first one within 500ms counts.
  const guardedPress = useGuardedPress<Parameters<NonNullable<PressableProps["onPress"]>>>((e) => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(e);
  });

  const tone = LABEL_TONE[variant];
  const status = color === "brand" ? null : statusColors(theme.colors, color, variant);
  const spinnerColor =
    status?.label ??
    (variant === "primary" ? theme.colors.onPrimary : variant === "secondary" ? theme.colors.onSecondary : theme.colors.text);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={guardedPress}
      style={({ pressed }) => [styles.base, status?.box, style, pressed && styles.pressed]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View style={styles.row}>
          {iconLeft}
          <Text variant={size === "sm" ? "captionL" : "body"} weight="semiBold" tone={tone} style={status && { color: status.label }}>
            {title}
          </Text>
          {icon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.primary },
        secondary: { backgroundColor: theme.colors.secondary },
        outline: {
          backgroundColor: theme.colors.surfaceRaised,
          borderWidth: 1,
          borderColor: theme.colors.stroke.soft,
        },
        ghost: { backgroundColor: "transparent" },
        soft: { backgroundColor: theme.colors.field },
      },
      size: {
        lg: { height: 48 },
        md: { height: 40 },
        sm: { height: 32, paddingHorizontal: theme.spacing.md },
      },
      fullWidth: {
        true: { alignSelf: "stretch" },
        false: { alignSelf: "flex-start" },
      },
      disabled: {
        true: { opacity: 0.5 },
      },
    },
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
}));
