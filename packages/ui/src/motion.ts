import { Easing, FadeIn, FadeInDown, withSequence, withTiming, type SharedValue } from "react-native-reanimated";

/**
 * One motion language: short, quiet, no overshoot. Things fade in and travel a few points at
 * most; presses answer with a highlight, not a bounce.
 */
export const EASE = Easing.out(Easing.cubic);
/** iOS sheet curve: quick start, long soft landing. */
export const EASE_IOS = Easing.bezier(0.32, 0.72, 0, 1);
/** For exits: eases off the mark, then leaves, so nothing snaps away. */
export const EASE_EXIT = Easing.inOut(Easing.cubic);

export const duration = { press: 80, release: 200, fade: 220, rise: 260, open: 340, close: 320 } as const;

/** Fade in while rising 6pt. */
export const rise = (delay = 0) =>
  FadeInDown.delay(delay)
    .duration(duration.rise)
    .easing(EASE)
    .withInitialValues({ opacity: 0, transform: [{ translateY: 6 }] });

/** Plain fade. */
export const fade = (delay = 0) => FadeIn.delay(delay).duration(duration.fade).easing(EASE);

/** Small horizontal shake for rejected input (pair it with an error haptic). */
export const SHAKE = [-6, 6, -4, 4, -2, 0];

export function shake(value: SharedValue<number>) {
  "worklet";
  value.value = withSequence(...SHAKE.map((x) => withTiming(x, { duration: 40 })));
}
