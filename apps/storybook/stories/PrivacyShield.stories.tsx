import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { PrivacyShield, Text } from "@okoli/ui";
import { Card } from "./helpers/layout";

const meta = {
  title: "Components/PrivacyShield",
  component: PrivacyShield,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The banking-app privacy screen. When the app stops being active (app switcher, notification shade, going home) it blurs everything under a light brand tint, so balances never show in the app-switcher snapshot. It appears instantly and fades out when you come back.",
          "",
          "Mount it last in the root layout, and pass it as the `overlay` of every `Sheet` (a Modal is its own window).",
          "",
          "```tsx",
          "<PrivacyShield>",
          "  <Logo size={56} />",
          "</PrivacyShield>",
          "```",
        ].join("\n"),
      },
    },
  },
  args: { forceVisible: true },
} satisfies Meta<typeof PrivacyShield>;

export default meta;
type Story = StoryObj<typeof meta>;

function Balance() {
  return (
    <Card>
      <Text variant="captionL" tone="secondary">
        Available balance
      </Text>
      <Text variant="h1" weight="bold">
        ₦1,240,500.00
      </Text>
      <Text tone="secondary">This is what the shield hides.</Text>
    </Card>
  );
}

/** Forced on here; in an app it only shows while the app is inactive. */
export const Preview: Story = {
  render: (args) => (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Balance />
      <PrivacyShield {...args}>
        <Text variant="h4" weight="bold">
          Your logo
        </Text>
      </PrivacyShield>
    </View>
  ),
};

/** `tint` changes the wash over the blur. */
export const CustomTint: Story = {
  args: { tint: "#F97316" },
  render: (args) => (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Balance />
      <PrivacyShield {...args}>
        <Text variant="h4" weight="bold">
          Ember
        </Text>
      </PrivacyShield>
    </View>
  ),
};
