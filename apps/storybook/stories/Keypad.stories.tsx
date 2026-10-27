import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Keypad, PinPad, Text, type KeypadKey } from "@okoli/ui";
import { Card, Section, Stack } from "./helpers/layout";

const meta = {
  title: "Components/Keypad",
  component: Keypad,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A number pad like the iOS passcode screen: a disc appears behind a key while it is held and lingers briefly, so even quick taps visibly land. `decimal` adds a `.` key for amounts; `compact` tightens the rows to fit in a sheet.",
          "",
          "`PinPad` puts PIN dots above the keypad. Return `false` from `onComplete` to reject a PIN: the dots shake and clear.",
          "",
          "```tsx",
          "<Keypad decimal onKey={(k) => setAmount(applyKey(amount, k))} />",
          "",
          "<PinPad length={4} onComplete={async (pin) => (await verify(pin)) ? unlock() : false} />",
          "```",
        ].join("\n"),
      },
    },
  },
  args: { decimal: false, compact: false, onKey: () => {} },
  argTypes: { onKey: { action: "key" } },
} satisfies Meta<typeof Keypad>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The bare keypad; each press is logged in the Actions panel. */
export const Playground: Story = {};

/** Amount entry with a decimal key and a two-decimal limit. */
export const Amount: Story = {
  args: { decimal: true },
  render: function Amount(args) {
    const [amount, setAmount] = useState("");
    const onKey = (k: KeypadKey) =>
      setAmount((a) => {
        if (k === "del") return a.slice(0, -1);
        if (k === "." && (a.includes(".") || !a)) return a;
        if (a.includes(".") && a.split(".")[1].length >= 2) return a;
        return a + k;
      });
    return (
      <View style={{ gap: 32 }}>
        <Text variant="display" weight="bold" align="center">
          ₦{amount || "0"}
        </Text>
        <Keypad {...args} onKey={onKey} />
      </View>
    );
  },
};

/** Six-digit PIN. Any PIN passes except 000000, which is rejected so you can see the shake. */
export const Pin: Story = {
  render: function Pin() {
    const [result, setResult] = useState("Enter a PIN (000000 is rejected)");
    return (
      <View style={{ gap: 24 }}>
        <Text tone="secondary" align="center">
          {result}
        </Text>
        <PinPad
          onComplete={(pin) => {
            const ok = pin !== "000000";
            setResult(ok ? `Accepted ${pin}` : "Wrong PIN, try again");
            return ok;
          }}
        />
      </View>
    );
  },
};

/** A four-digit compact PIN on a card, as it would sit inside a sheet. */
export const CompactPin: Story = {
  render: function CompactPin() {
    const [done, setDone] = useState(false);
    return (
      <Stack>
        <Section title="length={4} compact">
          <Card>
            <Text variant="h5" weight="bold" align="center">
              {done ? "Unlocked" : "Enter your PIN"}
            </Text>
            <PinPad length={4} compact onComplete={() => setDone(true)} />
          </Card>
        </Section>
      </Stack>
    );
  },
};
