import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button, PinPad, PrivacyShield, Sheet, Tappable, Text } from "@okoli/ui";
import { Stack } from "./helpers/layout";
import { Plus, Send, Trash } from "./helpers/icons";

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A bottom sheet that slides up over a blurred, dimmed backdrop with the iOS sheet curve. Drag it down past 100pt (or flick it) to dismiss, or tap outside. When its content changes height, the panel eases to the new size, which suits multi-step flows.",
          "",
          "While it slides out it keeps showing its last open content, so data you reset on close is never seen changing. Do resets in `onClosed`, which runs once the sheet is fully off screen, rather than in `onClose` or on a timer.",
          "",
          "It renders in a `Modal`, which is its own window, so pass `<PrivacyShield />` as `overlay` if the app uses one.",
          "",
          "```tsx",
          "<Sheet visible={open} onClose={() => setOpen(false)} onClosed={resetForm} overlay={<PrivacyShield />}>",
          '  <Text variant="h4" weight="bold">Confirm transfer</Text>',
          '  <Button title="Send" onPress={send} />',
          "</Sheet>",
          "```",
        ].join("\n"),
      },
    },
  },
  args: { visible: false, onClose: () => {}, children: null },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open it, then drag down, tap outside, or press Done. */
export const Basic: Story = {
  render: function Basic() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button title="Open sheet" onPress={() => setOpen(true)} />
        <Sheet visible={open} onClose={() => setOpen(false)} overlay={<PrivacyShield />}>
          <View style={styles.body}>
            <Text variant="h4" weight="bold">
              Confirm transfer
            </Text>
            <Text tone="secondary">Drag down, tap outside, or press Done to close.</Text>
            <Button title="Done" onPress={() => setOpen(false)} />
          </View>
        </Sheet>
      </>
    );
  },
};

/** The panel eases its height between steps: Review, then PIN. The step resets in `onClosed`, after the sheet is gone. */
export const Wizard: Story = {
  render: function Wizard() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"review" | "pin">("review");
    const close = () => setOpen(false);
    return (
      <>
        <Button title="Send ₦5,000" onPress={() => setOpen(true)} />
        <Sheet visible={open} onClose={close} onClosed={() => setStep("review")}>
          {step === "review" ? (
            <View style={styles.body}>
              <Text variant="h4" weight="bold">
                Review
              </Text>
              <View style={styles.line}>
                <Text tone="secondary">To</Text>
                <Text weight="semiBold">Ada Okafor</Text>
              </View>
              <View style={styles.line}>
                <Text tone="secondary">Amount</Text>
                <Text weight="semiBold">₦5,000.00</Text>
              </View>
              <View style={styles.line}>
                <Text tone="secondary">Fee</Text>
                <Text weight="semiBold">₦0.00</Text>
              </View>
              <Button title="Confirm" onPress={() => setStep("pin")} />
            </View>
          ) : (
            <View style={styles.body}>
              <Text variant="h5" weight="bold" align="center">
                Enter your PIN
              </Text>
              <PinPad compact onComplete={close} />
            </View>
          )}
        </Sheet>
      </>
    );
  },
};

/** An action menu. */
export const Actions: Story = {
  render: function Actions() {
    const [open, setOpen] = useState(false);
    const { theme } = useUnistyles();
    const actions = [
      { label: "Send money", icon: <Send color={theme.colors.text} /> },
      { label: "Add a card", icon: <Plus color={theme.colors.text} /> },
    ];
    return (
      <>
        <Button title="More actions" variant="outline" onPress={() => setOpen(true)} />
        <Sheet visible={open} onClose={() => setOpen(false)}>
          <View style={styles.menu}>
            {actions.map((a) => (
              <Tappable key={a.label} style={styles.action} onPress={() => setOpen(false)}>
                {a.icon}
                <Text weight="semiBold">{a.label}</Text>
              </Tappable>
            ))}
            <Tappable style={styles.action} onPress={() => setOpen(false)}>
              <Trash color={theme.colors.danger} />
              <Text weight="semiBold" tone="danger">
                Remove account
              </Text>
            </Tappable>
          </View>
        </Sheet>
      </>
    );
  },
};

/** A destructive confirmation using the danger colour. */
export const Confirm: Story = {
  render: function Confirm() {
    const [open, setOpen] = useState(false);
    return (
      <Stack>
        <Button title="Remove card" variant="soft" color="danger" onPress={() => setOpen(true)} />
        <Sheet visible={open} onClose={() => setOpen(false)}>
          <View style={styles.body}>
            <Text variant="h4" weight="bold">
              Remove this card?
            </Text>
            <Text tone="secondary">Payments set up on it will stop. You can add it again later.</Text>
            <Button title="Remove card" color="danger" onPress={() => setOpen(false)} />
            <Button title="Cancel" variant="ghost" onPress={() => setOpen(false)} />
          </View>
        </Sheet>
      </Stack>
    );
  },
};

const styles = StyleSheet.create((theme) => ({
  body: { gap: theme.spacing.lg },
  line: { flexDirection: "row", justifyContent: "space-between" },
  menu: { gap: theme.spacing.xs },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },
}));
