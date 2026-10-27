import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { TappableProps } from "./tappable";

export type { TappableProps } from "./tappable";

/**
 * Web build of Tappable. Reanimated flattens style arrays on web, which drops Unistyles' class
 * names, so the dim comes from Pressable's pressed state instead (no haptics on web).
 */
export function Tappable({ style, haptic: _haptic, ...rest }: TappableProps) {
  return <Pressable accessibilityRole="button" {...rest} style={({ pressed }) => [style, pressed && styles.pressed]} />;
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.65 },
});
