import type { TextStyle } from "react-native";

/**
 * The theme contract every app hands to Unistyles. Components only read these keys, so an app
 * can rebrand the whole kit by swapping values (see `createTheme`) and may add keys of its own.
 */
export type FontToken = Pick<TextStyle, "fontFamily" | "fontWeight">;
export type TypeToken = { fontSize: number; lineHeight: number };

export type OkoliColors = {
  /** Screen background. */
  background: string;
  /** Cards and sheets sitting on the background. */
  surface: string;
  /** Buttons, chips, secondary surfaces. */
  surfaceRaised: string;
  /** Input fields. */
  field: string;
  surfaceMuted: string;

  text: string;
  textSecondary: string;
  textTertiary: string;
  textQuaternary: string;

  /** Main action colour and the text drawn on it. */
  primary: string;
  onPrimary: string;
  /** Strong second colour (dark buttons, filled PIN dots) and the text drawn on it. */
  secondary: string;
  onSecondary: string;

  /** Translucent ink for pressed states and dividers; flips to light ink in dark themes. */
  fill: { strong: string; medium: string; soft: string; faint: string };
  stroke: { strong: string; soft: string };
  /** Dim layer behind modals. */
  scrim: string;

  /** Status colours: the solid colour, its pale fill, and the text drawn on the solid colour. */
  success: string;
  successSoft: string;
  onSuccess: string;
  warning: string;
  warningSoft: string;
  onWarning: string;
  danger: string;
  dangerSoft: string;
  onDanger: string;
  info: string;
  infoSoft: string;
  onInfo: string;
};

export type OkoliTheme = {
  name: string;
  dark: boolean;
  colors: OkoliColors;
  fonts: { regular: FontToken; medium: FontToken; semiBold: FontToken; bold: FontToken };
  typography: {
    display: TypeToken;
    h1: TypeToken;
    h2: TypeToken;
    h3: TypeToken;
    h4: TypeToken;
    h5: TypeToken;
    bodyL: TypeToken;
    body: TypeToken;
    captionL: TypeToken;
    captionS: TypeToken;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number; xxxl: number; gutter: number };
  radius: { sm: number; md: number; lg: number; xl: number; xxl: number; sheet: number; pill: number };
};

const ink = (alpha: number) => `rgba(24, 24, 27, ${alpha})`;
const paper = (alpha: number) => `rgba(250, 250, 250, ${alpha})`;

export const lightTheme: OkoliTheme = {
  name: "light",
  dark: false,
  colors: {
    background: "#F4F4F5",
    surface: "#FFFFFF",
    surfaceRaised: "#FAFAFA",
    field: "#F9FAFB",
    surfaceMuted: "#EEF0F3",

    text: "#18181B",
    textSecondary: "#71717A",
    textTertiary: "#A1A1AA",
    textQuaternary: "#D4D4D8",

    primary: "#18181B",
    onPrimary: "#FFFFFF",
    secondary: "#27272A",
    onSecondary: "#FFFFFF",

    fill: { strong: ink(0.16), medium: ink(0.08), soft: ink(0.04), faint: ink(0.02) },
    stroke: { strong: ink(0.12), soft: ink(0.06) },
    scrim: "rgba(0, 0, 0, 0.1)",

    success: "#16A34A",
    successSoft: "#F0FDF4",
    onSuccess: "#FFFFFF",
    warning: "#EAB308",
    warningSoft: "#FEFCE8",
    onWarning: "#422006",
    danger: "#DC2626",
    dangerSoft: "#FEF2F2",
    onDanger: "#FFFFFF",
    info: "#2563EB",
    infoSoft: "#EFF6FF",
    onInfo: "#FFFFFF",
  },
  fonts: {
    regular: { fontWeight: "400" },
    medium: { fontWeight: "500" },
    semiBold: { fontWeight: "600" },
    bold: { fontWeight: "700" },
  },
  typography: {
    display: { fontSize: 36, lineHeight: 44 },
    h1: { fontSize: 32, lineHeight: 40 },
    h2: { fontSize: 28, lineHeight: 36 },
    h3: { fontSize: 24, lineHeight: 32 },
    h4: { fontSize: 20, lineHeight: 28 },
    h5: { fontSize: 18, lineHeight: 26 },
    bodyL: { fontSize: 16, lineHeight: 24 },
    body: { fontSize: 14, lineHeight: 20 },
    captionL: { fontSize: 12, lineHeight: 17 },
    captionS: { fontSize: 10, lineHeight: 14 },
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, gutter: 16 },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, sheet: 28, pill: 999 },
};

export const darkTheme: OkoliTheme = {
  ...lightTheme,
  name: "dark",
  dark: true,
  colors: {
    ...lightTheme.colors,
    background: "#09090B",
    surface: "#18181B",
    surfaceRaised: "#1F1F23",
    field: "#232327",
    surfaceMuted: "#2A2A2F",

    text: "#FAFAFA",
    textSecondary: "#A1A1AA",
    textTertiary: "#71717A",
    textQuaternary: "#52525B",

    primary: "#FAFAFA",
    onPrimary: "#18181B",
    secondary: "#E4E4E7",
    onSecondary: "#18181B",

    fill: { strong: paper(0.16), medium: paper(0.08), soft: paper(0.04), faint: paper(0.02) },
    stroke: { strong: paper(0.12), soft: paper(0.06) },
    scrim: "rgba(0, 0, 0, 0.4)",

    successSoft: "#052E16",
    warningSoft: "#2E2304",
    dangerSoft: "#3B0A0A",
    infoSoft: "#0B1A3D",
  },
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function merge<T>(base: T, patch: DeepPartial<T>): T {
  const out = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch)) {
    const current = out[key];
    out[key] =
      value && typeof value === "object" && current && typeof current === "object"
        ? merge(current, value as DeepPartial<typeof current>)
        : value;
  }
  return out as T;
}

/** A brand theme: start from a base (light or dark) and override only what differs. */
export function createTheme<Extra extends object = object>(
  base: OkoliTheme,
  overrides: DeepPartial<OkoliTheme> & Extra,
): OkoliTheme & Extra {
  return merge(base as OkoliTheme & Extra, overrides as DeepPartial<OkoliTheme & Extra>);
}
