import { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native-unistyles";
import { EASE_EXIT, EASE_IOS, duration } from "../motion";

const OPEN = { duration: duration.open, easing: EASE_IOS };
const CLOSE = { duration: duration.close, easing: EASE_EXIT };
/** Where the panel starts before it has been measured. */
const OFFSCREEN = 900;
const ROOT = { flex: 1, justifyContent: "flex-end" } as const;
const FILL = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 } as const;
const CLIP = { overflow: "hidden" } as const;
const TOP = { position: "absolute", top: 0, left: 0, right: 0 } as const;

export type SheetProps = {
  visible: boolean;
  /** The user asked to close it (backdrop tap, drag down, back button). Set `visible` to false. */
  onClose: () => void;
  /**
   * Runs once the sheet is fully off screen. Reset the sheet's data here (step, form, selection),
   * not in `onClose`: anything that changes while it slides out would be seen changing.
   */
  onClosed?: () => void;
  children: React.ReactNode;
  /**
   * Rendered on top of everything inside the sheet's window. A Modal is its own window above the
   * app, so pass `<PrivacyShield />` here if the app uses one.
   */
  overlay?: React.ReactNode;
};

/**
 * Bottom sheet: slides up over a blurred, lightly dimmed backdrop with an iOS-like ease, drags down
 * to dismiss, and eases its height when the content changes (a wizard moving from Review to PIN).
 * While it slides out it keeps showing what it showed when it was last open, so data the app
 * resets on close is never seen changing.
 */
export function Sheet({ visible, onClose, onClosed, children, overlay }: SheetProps) {
  const [mounted, setMounted] = useState(visible);
  const [lastOpen, setLastOpen] = useState(children);
  const y = useSharedValue(OFFSCREEN);
  const drag = useSharedValue(0);
  /** The panel's (animated) height; 0 until the content has been measured. */
  const height = useSharedValue(0);

  // Mount as soon as it should show; unmount only after the slide-out finishes.
  if (visible && !mounted) setMounted(true);
  // Remember the open content, to keep showing it during the slide-out.
  if (visible && lastOpen !== children) setLastOpen(children);

  const finish = () => {
    setMounted(false);
    height.value = 0;
    onClosed?.();
  };

  useEffect(() => {
    if (visible) {
      drag.value = 0;
      y.value = withTiming(0, OPEN);
    } else if (mounted) {
      // Travel only the panel's own height (minus any drag already done), so it never whips away.
      y.value = withTiming(Math.max(0, height.value - drag.value), CLOSE, (done) => {
        if (done) runOnJS(finish)();
      });
    }
    // `finish` only uses setters and the latest onClosed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, mounted, y, drag, height]);

  // The content's natural height drives the panel: taken as-is the first time, eased after that.
  const onContentLayout = (h: number) => {
    if (!height.value) height.value = h;
    else if (Math.abs(h - height.value) > 0.5) height.value = withTiming(h, OPEN);
  };

  const close = () => onClose();

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      drag.set(Math.max(0, e.translationY));
    })
    .onEnd((e) => {
      if (drag.value > 100 || e.velocityY > 900) {
        runOnJS(close)();
      } else {
        drag.set(withTiming(0, OPEN));
      }
    });

  const panel = useAnimatedStyle(() => ({
    height: height.value,
    transform: [{ translateY: y.value + drag.value }],
  }));
  // The blur follows the sheet: fully in when open, gone once the panel is fully off screen.
  const backdrop = useAnimatedStyle(() => ({
    opacity: height.value ? 1 - Math.min(1, (y.value + drag.value) / height.value) : 0,
  }));

  return (
    <Modal transparent visible={mounted} animationType="none" statusBarTranslucent onRequestClose={close}>
      {/* Third-party and Animated views get plain styles: on web they can't read Unistyles' class names. */}
      <GestureHandlerRootView style={ROOT}>
        <Animated.View style={[FILL, backdrop]}>
          <BlurView intensity={60} tint="dark" style={FILL} />
          <Pressable style={[styles.fill, styles.dim]} onPress={close} accessibilityRole="button" accessibilityLabel="Close" />
        </Animated.View>
        <View style={styles.column}>
          <GestureDetector gesture={pan}>
            {/* The panel's height eases between steps. Its surface always reaches the bottom edge,
                and the content, pinned to the top, is revealed or covered as it grows or shrinks. */}
            <Animated.View accessibilityViewIsModal style={[CLIP, panel]}>
              <View style={[FILL, styles.surface]} />
              <View style={TOP} onLayout={(e) => onContentLayout(e.nativeEvent.layout.height)}>
                <View style={styles.content}>
                  <View style={styles.grabber} />
                  {visible ? children : lastOpen}
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
        {overlay}
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  fill: { flex: 1 },
  dim: { backgroundColor: theme.colors.scrim },
  // A browser window is wider than a phone: keep the sheet phone-sized and centred.
  column: { _web: { width: "100%", maxWidth: 480, marginHorizontal: "auto" } },
  surface: {
    borderTopLeftRadius: theme.radius.sheet,
    borderTopRightRadius: theme.radius.sheet,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.gutter,
    paddingTop: 10,
    paddingBottom: rt.insets.bottom + 12,
  },
  grabber: {
    alignSelf: "center",
    width: 36,
    height: 5,
    borderRadius: 3,
    marginBottom: 16,
    backgroundColor: theme.colors.textQuaternary,
  },
}));
