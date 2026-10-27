# @okoli/ui

My React Native UI kit: one theme contract, one motion language and the components I keep rebuilding, shared across my Expo apps.

```
packages/ui       @okoli/ui (the library)
apps/storybook    on-device Storybook that documents every component
```

## Stack

- Styling: [Unistyles 3](https://www.unistyl.es) (theme tokens + variants, no re-render on theme change)
- Motion: Reanimated 4 + Gesture Handler
- Only Expo-SDK-managed native packages as peers, so upgrading is one `expo install --fix`

## Use it in an app

```sh
npx expo install @okoli/ui react-native-unistyles react-native-nitro-modules react-native-edge-to-edge \
  react-native-reanimated react-native-worklets react-native-gesture-handler react-native-svg expo-haptics expo-blur
```

**1. Babel**: the Unistyles plugin skips `node_modules`, so list the kit:

```js
plugins: [["react-native-unistyles/plugin", { root: "src", autoProcessPaths: ["@okoli/ui"] }]];
```

**2. Themes**: register them before anything renders (import this file first in the entry or root layout):

```ts
import { StyleSheet } from "react-native-unistyles";
// Import from "@okoli/ui/theme", not "@okoli/ui": the main entry loads the components, whose
// stylesheets must not be created before StyleSheet.configure runs.
import { createTheme, darkTheme, lightTheme } from "@okoli/ui/theme";

const brand = createTheme(lightTheme, { colors: { primary: "#ECF0AF", onPrimary: "#0B4647" } });
const themes = { light: brand, dark: darkTheme };

type AppThemes = typeof themes;
declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({ themes, settings: { initialTheme: "light" } });
```

Custom fonts go in `fonts` (e.g. `fonts: { bold: { fontFamily: "PlusJakartaSans_700Bold" } }`). Apps can add extra keys to their themes; the kit only reads the `OkoliTheme` contract.

## What's in it

| Export | What it does |
| --- | --- |
| `lightTheme`, `darkTheme`, `createTheme` | Default themes and a deep-merge helper for brand presets |
| `motion` | `EASE`, `EASE_IOS`, `duration`, `rise()`, `fade()`, `shake()` |
| `Text` | Type scale × weight × tone × align variants, Dynamic Type capped at 1.35 |
| `Button` | primary / secondary / outline / soft / ghost × brand / success / warning / danger / info, 3 sizes, icons, loading, double-tap guard, haptic |
| `Tappable` | Pressable that dims and ticks a haptic |
| `Sheet` | Bottom sheet: blur backdrop, iOS ease, drag to dismiss, animated height |
| `Keypad`, `PinPad` | Number pad with press discs; PIN dots that shake and clear on rejection |
| `SearchBar` | 48pt search field with an always-visible clear button |
| `PrivacyShield` | Blurs the app in the app switcher |
| `useGuardedPress` | Drops double taps |

## Storybook

Two Storybooks share the same stories (`apps/storybook/stories`):

- **Docs website** (`.storybook`, React Native Web + Vite): Introduction page, a Docs page per component with descriptions, props tables and code, and a Theme menu in the toolbar.
- **Phone** (`.rnstorybook`): on-device, for haptics, gestures and blur.

```sh
npm install
npm run docs            # docs website at http://localhost:6006
npm run docs:build      # static site in apps/storybook/storybook-static (GitHub Pages ready)
npm run storybook:web   # the phone UI in a browser at http://localhost:8097
npm run storybook:ios   # on the iOS simulator (first run builds the dev client)
npm run storybook       # afterwards: just Metro
```

Web rules for components:

- Unistyles styles go only on React Native's own views. `Animated.*` views and third-party views (Gesture Handler's root, `BlurView`) take plain style objects; put the themed styles on a `View` inside them. On web those views can't apply Unistyles' class names.
- `Tappable` has a `.web.tsx` build for the same reason.
- Anything that must react instantly uses `delayPressIn={0}`: React Native Web otherwise waits 50ms and skips `onPressIn` on quick clicks.

New stories go in `apps/storybook/stories`; run `npm run storybook-generate --workspace apps/storybook` if one doesn't show up.
