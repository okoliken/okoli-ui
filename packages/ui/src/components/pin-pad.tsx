import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import { shake } from "../motion";
import { Keypad, type KeypadKey, type KeypadProps } from "./keypad";

export type PinPadProps = {
  /**
   * Runs once the last digit is in; further keys are ignored while it runs. Return `false` (or a
   * promise of it) to reject the PIN: the dots shake and clear for another try.
   */
  onComplete: (pin: string) => boolean | void | Promise<boolean | void>;
  length?: number;
  compact?: boolean;
  /** Control the entered digits from outside (e.g. a scripted demo); omit to let the pad own them. */
  value?: string;
  onChangeValue?: (pin: string) => void;
} & Pick<KeypadProps, "deleteIcon" | "digitStyle" | "keyWidth">;

/** PIN dots + keypad. Deleting on an empty PIN, or a rejected PIN, shakes the dots. */
export function PinPad({
  onComplete,
  length = 6,
  compact = false,
  value,
  onChangeValue,
  deleteIcon,
  digitStyle,
  keyWidth,
}: PinPadProps) {
  const [own, setOwn] = useState("");
  const pin = value ?? own;
  const setPin = (next: string | ((p: string) => string)) => {
    const resolved = typeof next === "function" ? next(pin) : next;
    if (value === undefined) setOwn(resolved);
    onChangeValue?.(resolved);
  };
  const offset = useSharedValue(0);
  const complete = pin.length === length;

  useEffect(() => {
    if (!complete) return;
    let live = true;
    // Let the last dot fill before handing over.
    const t = setTimeout(async () => {
      const ok = await onComplete(pin);
      if (!live || ok !== false) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      shake(offset);
      setPin("");
    }, 150);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [complete, pin, onComplete, offset]);

  const onKey = (k: KeypadKey) => {
    if (complete) return;
    if (k === "del") {
      if (!pin) return shake(offset);
      return setPin((p) => p.slice(0, -1));
    }
    if (k !== ".") setPin((p) => p + k);
  };

  const dotsStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <View>
      {/* Animated views get no Unistyles styles (web can't apply them); the themed row sits inside. */}
      <Animated.View style={dotsStyle} accessible accessibilityLabel={`PIN, ${pin.length} of ${length} digits entered`}>
        <View style={[styles.dots, compact && styles.dotsCompact]}>
          {Array.from({ length }, (_, i) => (
            <Dot key={i} filled={i < pin.length} />
          ))}
        </View>
      </Animated.View>
      <Keypad onKey={onKey} compact={compact} deleteIcon={deleteIcon} digitStyle={digitStyle} keyWidth={keyWidth} />
    </View>
  );
}

const FILL = { flex: 1 } as const;

/** 16pt dot: textQuaternary when empty, secondary when filled (quick fade). */
function Dot({ filled }: { filled: boolean }) {
  const p = useSharedValue(filled ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(filled ? 1 : 0, { duration: filled ? 120 : 100 });
  }, [filled, p]);
  const fill = useAnimatedStyle(() => ({ opacity: p.value }));
  return (
    <View style={styles.dot}>
      <Animated.View style={[FILL, fill]}>
        <View style={styles.dotFill} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  dots: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 32, marginBottom: 54 },
  dotsCompact: { paddingHorizontal: 56, marginBottom: 24 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: theme.colors.textQuaternary },
  dotFill: { flex: 1, borderRadius: 8, backgroundColor: theme.colors.secondary },
}));
