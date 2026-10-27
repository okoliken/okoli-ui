import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Button, Text, type ButtonColor, type ButtonVariant } from "@okoli/ui";
import { Card, Row, Section, Stack } from "./helpers/layout";
import { ArrowRight, Plus, Send, Trash } from "./helpers/icons";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "outline", "soft", "ghost"];
const COLORS: ButtonColor[] = ["brand", "success", "warning", "danger", "info"];

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The main action. `variant` sets how it is drawn (solid, outline, soft fill, bare text) and `color` sets the palette: `brand` follows the theme, the rest use the status colours.",
          "",
          "Every press gives a light haptic, and a 500ms guard drops double taps so a quick double tap never submits twice.",
          "",
          "```tsx",
          'import { Button } from "@okoli/ui";',
          "",
          '<Button title="Continue" onPress={next} />',
          '<Button title="Delete card" variant="soft" color="danger" onPress={remove} />',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Continue",
    variant: "primary",
    color: "brand",
    size: "lg",
    loading: false,
    disabled: false,
    fullWidth: true,
    haptic: true,
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    color: { control: "select", options: COLORS },
    size: { control: "select", options: ["lg", "md", "sm"] },
    onPress: { action: "pressed" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Change any prop from the controls panel. */
export const Playground: Story = {};

/** The five ways a button can be drawn, in the brand colours. */
export const Variants: Story = {
  render: () => (
    <Stack>
      {VARIANTS.map((v) => (
        <Button key={v} title={v[0].toUpperCase() + v.slice(1)} variant={v} />
      ))}
    </Stack>
  ),
};

/** Every colour in every variant. Switch the theme to see `brand` change while the status colours stay put. */
export const Colors: Story = {
  render: () => (
    <Stack gap={20}>
      {COLORS.map((c) => (
        <Section key={c} title={c}>
          <Row>
            {VARIANTS.map((v) => (
              <Button key={v} title={v} variant={v} color={c} size="sm" fullWidth={false} />
            ))}
          </Row>
        </Section>
      ))}
    </Stack>
  ),
};

/** 48, 40 and 32pt tall. `sm` uses the smaller caption label. */
export const Sizes: Story = {
  render: () => (
    <Stack>
      <Button title="Large (48)" size="lg" />
      <Button title="Medium (40)" size="md" />
      <Button title="Small (32)" size="sm" />
      <Section title="Inline" note="fullWidth={false} hugs the label">
        <Row>
          <Button title="Large" size="lg" fullWidth={false} />
          <Button title="Medium" size="md" fullWidth={false} />
          <Button title="Small" size="sm" fullWidth={false} />
        </Row>
      </Section>
    </Stack>
  ),
};

/** `iconLeft` sits before the label and `icon` after it. Any element works; colour it to match the label. */
export const WithIcons: Story = {
  render: function WithIcons() {
    const { theme } = useUnistyles();
    return (
      <Stack>
        <Button title="Send money" iconLeft={<Send color={theme.colors.onPrimary} />} />
        <Button title="Next" variant="secondary" icon={<ArrowRight color={theme.colors.onSecondary} />} />
        <Button title="Add card" variant="outline" iconLeft={<Plus color={theme.colors.text} />} />
        <Button
          title="Delete"
          variant="soft"
          color="danger"
          iconLeft={<Trash color={theme.colors.danger} />}
        />
        <Row>
          <Button title="New" size="sm" fullWidth={false} iconLeft={<Plus size={14} color={theme.colors.onPrimary} />} />
          <Button
            title="More"
            size="sm"
            variant="ghost"
            fullWidth={false}
            icon={<ArrowRight size={14} color={theme.colors.text} />}
          />
        </Row>
      </Stack>
    );
  },
};

/** `loading` swaps the label for a spinner and blocks presses; `disabled` fades the button to half opacity. */
export const States: Story = {
  render: () => (
    <Stack gap={20}>
      <Section title="Loading">
        {VARIANTS.slice(0, 4).map((v) => (
          <Button key={v} title={v} variant={v} loading />
        ))}
      </Section>
      <Section title="Disabled">
        {VARIANTS.map((v) => (
          <Button key={v} title={v} variant={v} disabled />
        ))}
      </Section>
    </Stack>
  ),
};

/** Common layouts: a two-button footer, a stacked confirm, and a destructive confirmation. */
export const Patterns: Story = {
  render: () => (
    <Stack gap={20}>
      <Section title="Footer pair">
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Button title="Cancel" variant="outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Confirm" />
          </View>
        </View>
      </Section>
      <Section title="Stacked">
        <Card>
          <Text variant="h5" weight="bold">
            Turn on notifications?
          </Text>
          <Text tone="secondary">Get a ping when money lands in your account.</Text>
          <Button title="Turn on" />
          <Button title="Not now" variant="ghost" />
        </Card>
      </Section>
      <Section title="Destructive">
        <Card>
          <Text variant="h5" weight="bold">
            Remove this card?
          </Text>
          <Text tone="secondary">You can add it again later.</Text>
          <Button title="Remove card" color="danger" />
          <Button title="Keep it" variant="soft" />
        </Card>
      </Section>
      <Section title="Status">
        <Button title="Payment sent" variant="soft" color="success" />
        <Button title="Verify your email" variant="outline" color="warning" />
        <Button title="Learn more" variant="ghost" color="info" />
      </Section>
    </Stack>
  ),
};
