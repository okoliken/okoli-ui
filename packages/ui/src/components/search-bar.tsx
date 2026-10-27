import { useRef } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CloseIcon, SearchIcon } from "../icons";

export type SearchBarProps = Omit<TextInputProps, "value" | "onChangeText"> & {
  value: string;
  onChangeText: (text: string) => void;
  /** Replaces the built-in magnifier, e.g. with the app's own icon set. */
  icon?: React.ReactNode;
  /** Replaces the built-in cross inside the clear button. */
  clearIcon?: React.ReactNode;
};

/**
 * 48pt search field, r12, raised fill with a soft stroke. A clear button fades in whenever there
 * is text (iOS's own only shows while focused) and keeps the keyboard up.
 */
export function SearchBar({ value, onChangeText, icon, clearIcon, style, ...rest }: SearchBarProps) {
  const { theme } = useUnistyles();
  const input = useRef<TextInput>(null);
  return (
    <View style={styles.bar}>
      {icon ?? <SearchIcon size={18} color={theme.colors.text} />}
      <TextInput
        ref={input}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[\r\n]+/g, " "))}
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="search"
        autoCorrect={false}
        maxFontSizeMultiplier={1.35}
        multiline
        scrollEnabled={false}
        submitBehavior="blurAndSubmit"
        accessibilityRole="search"
        {...rest}
        style={[styles.input, style]}
      />
      {value ? (
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(120)}>
          <Pressable
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => {
              onChangeText("");
              input.current?.focus();
            }}
            style={styles.clear}
          >
            {clearIcon ?? <CloseIcon size={12} color={theme.colors.surfaceRaised} />}
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const BAR_HEIGHT = 48;

const styles = StyleSheet.create((theme) => ({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    height: BAR_HEIGHT,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.colors.stroke.soft,
  },
  // A multiline (UITextView) box with scrolling off, filling the bar. A text view lays its text
  // out from the top by these insets, whereas the single-line UITextField re-centres by whichever
  // font metrics UIKit picks and can drift the text to the bottom of the bar after interaction.
  // Equal insets around one line centre it, and the full-height box means nothing can clip.
  // Pasted newlines are flattened in onChangeText.
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingVertical: (BAR_HEIGHT - theme.typography.body.lineHeight) / 2,
    paddingHorizontal: 0,
    ...theme.fonts.regular,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
    // The multiline box is a <textarea> on web: no focus ring, scrollbar or resize handle.
    _web: { outlineStyle: "none", overflow: "hidden", resize: "none" },
  },
  clear: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.textTertiary,
  },
}));
