import { Platform, Pressable, type StyleProp, type TextStyle, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import { BackspaceIcon } from "../icons";
import { Text } from "./text";

export type KeypadKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "." | "del";

// Animated views get plain styles (web can't put Unistyles' class names on them); the themed fill sits inside.
const DISC = { position: "absolute", width: 72, height: 72 } as const;
// React Native Web waits 50ms before onPressIn and skips it on quicker clicks; keys must land instantly.
// (Native fires onPressIn at once; the prop only exists on web.)
const INSTANT_PRESS_IN = Platform.OS === "web" ? ({ delayPressIn: 0 } as object) : {};

export type KeypadProps = {
  onKey: (k: KeypadKey) => void;
  /** Puts a "." in the empty bottom-left slot (amount entry). */
  decimal?: boolean;
  /** Tightens the rows to fit inside a sheet. */
  compact?: boolean;
  /** Replaces the built-in backspace glyph, e.g. with the app's own icon set. */
  deleteIcon?: React.ReactNode;
  /** Extra style for the digit labels (colour, font). */
  digitStyle?: StyleProp<TextStyle>;
  /** Fixed key width (e.g. a design's exact 114pt). By default keys share the row equally. */
  keyWidth?: number;
};

/** Number pad: 3 columns of 64pt keys, 12 apart; digits H3 bold, backspace 28pt. */
export function Keypad({ onKey, decimal = false, compact = false, deleteIcon, digitStyle, keyWidth }: KeypadProps) {
  const size = keyWidth == null ? null : { width: keyWidth, flex: 0 };
  const rows: (KeypadKey | null)[][] = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [decimal ? "." : null, "0", "del"],
  ];
  return (
    <View style={[styles.pad, compact && styles.padCompact]}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((k, c) =>
            k ? (
              <Key key={k} k={k} onKey={onKey} deleteIcon={deleteIcon} digitStyle={digitStyle} size={size} />
            ) : (
              <View key={`empty-${c}`} style={[styles.key, size]} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

/**
 * A disc shows behind the key while it is held, like the iOS passcode pad. It appears instantly
 * and lingers briefly on release, so even a quick tap visibly lands.
 */
function Key({
  k,
  onKey,
  deleteIcon,
  digitStyle,
  size,
}: { k: KeypadKey; onKey: (k: KeypadKey) => void; size: { width: number; flex: number } | null } & Pick<
  KeypadProps,
  "deleteIcon" | "digitStyle"
>) {
  const { theme } = useUnistyles();
  const down = useSharedValue(0);
  const disc = useAnimatedStyle(() => ({ opacity: down.value }));

  return (
    <Pressable
      accessibilityRole="keyboardkey"
      accessibilityLabel={k === "del" ? "Delete" : k === "." ? "Decimal point" : k}
      style={[styles.key, size]}
      {...INSTANT_PRESS_IN}
      onPressIn={() => {
        down.set(1);
        Haptics.selectionAsync().catch(() => {});
        onKey(k);
      }}
      onPressOut={() => down.set(withDelay(60, withTiming(0, { duration: 250 })))}
    >
      <Animated.View style={[DISC, disc]}>
        <View style={styles.disc} />
      </Animated.View>
      {k === "del" ? (
        (deleteIcon ?? <BackspaceIcon size={28} color={theme.colors.text} />)
      ) : (
        <Text variant="h3" weight="bold" style={digitStyle}>
          {k}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  pad: { gap: 32 },
  padCompact: { gap: 8 },
  row: { flexDirection: "row", gap: 12 },
  key: { flex: 1, height: 64, alignItems: "center", justifyContent: "center" },
  disc: { flex: 1, borderRadius: 36, backgroundColor: theme.colors.fill.medium },
}));
