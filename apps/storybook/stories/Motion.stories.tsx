import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { Button, Text, motion } from "@okoli/ui";
import { Section, Stack } from "./helpers/layout";

const meta = {
  title: "Foundations/Motion",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "One motion language: short, quiet, no overshoot. Things fade in and travel a few points at most; presses answer with a highlight, not a bounce. All presets are Reanimated layout animations or timing configs.",
          "",
          "```tsx",
          'import { motion } from "@okoli/ui";',
          "",
          "<Animated.View entering={motion.rise(index * 60)} />",
          "motion.shake(offset); // rejected input",
          "withTiming(1, { duration: motion.duration.open, easing: motion.EASE_IOS });",
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** `rise(delay)` fades in while rising 6pt; stagger it by index. */
export const Rise: Story = {
  render: function Rise() {
    const [run, setRun] = useState(0);
    return (
      <Stack>
        <Button title="Replay" variant="outline" onPress={() => setRun((r) => r + 1)} />
        {["First", "Second", "Third", "Fourth", "Fifth"].map((label, i) => (
          <Animated.View key={`${run}-${label}`} entering={motion.rise(i * 60)}>
            <View style={styles.card}>
              <Text weight="semiBold">{label}</Text>
            </View>
          </Animated.View>
        ))}
      </Stack>
    );
  },
};

/** `fade(delay)`: a plain fade for things that shouldn't move. */
export const Fade: Story = {
  render: function Fade() {
    const [run, setRun] = useState(0);
    return (
      <Stack>
        <Button title="Replay" variant="outline" onPress={() => setRun((r) => r + 1)} />
        <Animated.View key={run} entering={motion.fade()}>
          <View style={styles.card}>
            <Text weight="semiBold">Payment received</Text>
            <Text tone="secondary">₦12,000 from Bisi</Text>
          </View>
        </Animated.View>
      </Stack>
    );
  },
};

/** `shake(sharedValue)` for rejected input; pair it with an error haptic. */
export const Shake: Story = {
  render: function Shake() {
    const x = useSharedValue(0);
    const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
    return (
      <Stack>
        <Animated.View style={style}>
          <View style={styles.card}>
            <Text weight="semiBold" tone="danger">
              Wrong code
            </Text>
          </View>
        </Animated.View>
        <Button title="Shake" variant="outline" onPress={() => motion.shake(x)} />
      </Stack>
    );
  },
};

/** The curves compared: `EASE` (ease-out cubic), `EASE_IOS` (the iOS sheet curve) and `EASE_EXIT` (in-out cubic, for things leaving). */
export const Easing: Story = {
  render: function EasingStory() {
    const a = useSharedValue(0);
    const b = useSharedValue(0);
    const c = useSharedValue(0);
    const run = () => {
      const to = a.value === 0 ? 1 : 0;
      a.value = withTiming(to, { duration: motion.duration.open, easing: motion.EASE });
      b.value = withTiming(to, { duration: motion.duration.open, easing: motion.EASE_IOS });
      c.value = withTiming(to, { duration: motion.duration.close, easing: motion.EASE_EXIT });
    };
    const dotA = useAnimatedStyle(() => ({ left: `${a.value * 85}%` }));
    const dotB = useAnimatedStyle(() => ({ left: `${b.value * 85}%` }));
    const dotC = useAnimatedStyle(() => ({ left: `${c.value * 85}%` }));
    return (
      <Stack gap={20}>
        <Section title="EASE">
          <View style={styles.track}>
            <Animated.View style={[DOT, dotA]}>
              <View style={styles.dot} />
            </Animated.View>
          </View>
        </Section>
        <Section title="EASE_IOS">
          <View style={styles.track}>
            <Animated.View style={[DOT, dotB]}>
              <View style={styles.dot} />
            </Animated.View>
          </View>
        </Section>
        <Section title="EASE_EXIT">
          <View style={styles.track}>
            <Animated.View style={[DOT, dotC]}>
              <View style={styles.dot} />
            </Animated.View>
          </View>
        </Section>
        <Button title="Run" variant="outline" onPress={run} />
      </Stack>
    );
  },
};

/** The duration tokens, in milliseconds. */
export const Durations: Story = {
  render: () => (
    <Stack gap={8}>
      {Object.entries(motion.duration).map(([name, ms]) => (
        <View key={name} style={styles.line}>
          <Text weight="medium">{name}</Text>
          <Text tone="secondary">{ms} ms</Text>
        </View>
      ))}
    </Stack>
  ),
};

// Animated views take plain styles; themed ones go on a View inside (see the Sheet source).
const DOT = { position: "absolute", width: 32, height: 32 } as const;

const styles = StyleSheet.create((theme) => ({
  card: { padding: theme.spacing.lg, gap: 4, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface },
  track: { height: 40, justifyContent: "center", borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface },
  dot: { flex: 1, borderRadius: 16, backgroundColor: theme.colors.secondary },
  line: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
}));
