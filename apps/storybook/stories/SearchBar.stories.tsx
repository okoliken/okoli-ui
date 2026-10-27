import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { SearchBar, Tappable, Text } from "@okoli/ui";
import { Stack } from "./helpers/layout";

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A 48pt search field. The clear button fades in whenever there is text (iOS's own only shows while focused) and keeps the keyboard up. Pasted line breaks are flattened to spaces. Takes any `TextInput` prop except `value`/`onChangeText`, which are required.",
          "",
          "```tsx",
          'const [query, setQuery] = useState("");',
          '<SearchBar value={query} onChangeText={setQuery} placeholder="Search people" />',
          "```",
        ].join("\n"),
      },
    },
  },
  args: { value: "", onChangeText: () => {}, placeholder: "Search" },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Type to see the clear button appear. */
export const Default: Story = {
  render: function Default(args) {
    const [value, setValue] = useState("");
    return <SearchBar {...args} value={value} onChangeText={setValue} />;
  },
};

/** Starting with text already in it. */
export const WithValue: Story = {
  render: function WithValue(args) {
    const [value, setValue] = useState("Ada Lovelace");
    return <SearchBar {...args} value={value} onChangeText={setValue} />;
  },
};

const PEOPLE = ["Ada Okafor", "Bisi Adeyemi", "Chidi Nwosu", "Dayo Bello", "Emeka Obi", "Funke Akin", "Gbenga Ola"];

/** Filtering a list as you type, with an empty state. */
export const FilterList: Story = {
  render: function FilterList() {
    const [query, setQuery] = useState("");
    const matches = PEOPLE.filter((p) => p.toLowerCase().includes(query.trim().toLowerCase()));
    return (
      <Stack>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search people" />
        <View style={styles.list}>
          {matches.length ? (
            matches.map((name) => (
              <Tappable key={name} style={styles.row}>
                <View style={styles.avatar}>
                  <Text weight="bold" tone="onSecondary">
                    {name[0]}
                  </Text>
                </View>
                <Text weight="medium">{name}</Text>
              </Tappable>
            ))
          ) : (
            <Text tone="secondary" align="center" style={styles.empty}>
              No one called “{query}”
            </Text>
          )}
        </View>
      </Stack>
    );
  },
};

const styles = StyleSheet.create((theme) => ({
  list: { borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, paddingVertical: theme.spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.md },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
  },
  empty: { padding: theme.spacing.xl },
}));
