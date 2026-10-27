import { useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { FadeOut } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { duration } from "../motion";

// Plain styles: on web, third-party and Animated views can't read Unistyles' class names.
const FILL = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } as const;
const COVER = { ...FILL, zIndex: 1000, alignItems: "center", justifyContent: "center" } as const;

export type PrivacyShieldProps = {
  /** Shown centred on the blur, usually the app's logo. */
  children?: React.ReactNode;
  /** Colour washed over the blur so it reads as the app rather than a generic blur. Defaults to `secondary`. */
  tint?: string;
  /** Render it regardless of app state (previews, stories). */
  forceVisible?: boolean;
};

/**
 * Banking-app privacy screen: as soon as the app stops being active (app switcher, notification
 * shade, going home) the screen is blurred under a light tint, so sensitive numbers never show in
 * the app-switcher snapshot. It appears with no animation (iOS takes the snapshot right away) and
 * fades out on return. Mount it last in the root layout, and again inside every Modal.
 */
export function PrivacyShield({ children, tint, forceVisible = false }: PrivacyShieldProps) {
  const [hidden, setHidden] = useState(AppState.currentState !== "active");

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => setHidden(state !== "active"));
    return () => sub.remove();
  }, []);

  if (!hidden && !forceVisible) return null;
  return (
    <Animated.View exiting={FadeOut.duration(duration.fade)} style={COVER} pointerEvents="none">
      <BlurView intensity={60} tint="light" style={FILL} />
      <View style={[styles.tint, tint ? { backgroundColor: tint } : null]} />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme) => ({
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.secondary, opacity: 0.12 },
}));
