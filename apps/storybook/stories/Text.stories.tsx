import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text, type TextTone, type TextVariant, type TextWeight } from "@okoli/ui";
import { Card, Section, Stack } from "./helpers/layout";

const VARIANTS: TextVariant[] = ["display", "h1", "h2", "h3", "h4", "h5", "bodyL", "body", "captionL", "captionS"];
const WEIGHTS: TextWeight[] = ["regular", "medium", "semiBold", "bold"];
const TONES: TextTone[] = ["primary", "secondary", "tertiary", "danger", "success", "warning"];

const meta = {
  title: "Foundations/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "All text in the kit. `variant` picks a size from the type scale, `weight` the font, `tone` the colour by role. Sizes and fonts come from the theme, so a brand can swap the typeface in one place:",
          "",
          "```ts",
          "createTheme(lightTheme, {",
          '  fonts: { regular: { fontFamily: "PlusJakartaSans_400Regular" }, bold: { fontFamily: "PlusJakartaSans_700Bold" } },',
          "});",
          "```",
        ].join("\n"),
      },
    },
  },
  args: { children: "The quick brown fox", variant: "body", weight: "regular", tone: "primary", align: "left" },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    weight: { control: "select", options: WEIGHTS },
    tone: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "onPrimary", "onSecondary", "danger", "success", "warning"],
    },
    align: { control: "select", options: ["left", "center", "right"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Change any prop from the controls panel. */
export const Playground: Story = {};

/** The full type scale with its size and line height. */
export const Scale: Story = {
  render: () => {
    const sizes: Record<TextVariant, string> = {
      display: "36 / 44",
      h1: "32 / 40",
      h2: "28 / 36",
      h3: "24 / 32",
      h4: "20 / 28",
      h5: "18 / 26",
      bodyL: "16 / 24",
      body: "14 / 20",
      captionL: "12 / 17",
      captionS: "10 / 14",
    };
    return (
      <Stack gap={14}>
        {VARIANTS.map((v) => (
          <View key={v} style={{ gap: 2 }}>
            <Text variant="captionS" tone="tertiary">
              {v} · {sizes[v]}
            </Text>
            <Text variant={v} weight="bold">
              Send money
            </Text>
          </View>
        ))}
      </Stack>
    );
  },
};

/** The four weights. */
export const Weights: Story = {
  render: () => (
    <Stack>
      {WEIGHTS.map((w) => (
        <Text key={w} variant="h4" weight={w}>
          {w}
        </Text>
      ))}
    </Stack>
  ),
};

/** Colours by role, so text follows the theme instead of hard-coded hex. */
export const Tones: Story = {
  render: () => (
    <Stack>
      {TONES.map((t) => (
        <Text key={t} variant="bodyL" weight="medium" tone={t}>
          {t}
        </Text>
      ))}
    </Stack>
  ),
};

/** Text roles working together on a real card. */
export const InContext: Story = {
  render: () => (
    <Stack gap={20}>
      <Section title="Balance card">
        <Card>
          <Text variant="captionL" tone="secondary">
            Available balance
          </Text>
          <Text variant="h1" weight="bold">
            ₦1,240,500.00
          </Text>
          <Text variant="captionL" tone="success" weight="semiBold">
            +₦12,000 today
          </Text>
        </Card>
      </Section>
      <Section title="Article">
        <Card>
          <Text variant="h4" weight="bold">
            Faster transfers are here
          </Text>
          <Text tone="secondary">
            Send money to any bank in seconds. No codes, no waiting, and you get a receipt the moment it lands.
          </Text>
          <Text variant="captionL" tone="tertiary">
            2 min read
          </Text>
        </Card>
      </Section>
    </Stack>
  ),
};
