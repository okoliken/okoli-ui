import type { StorybookConfig } from "@storybook/react-native-web-vite";

/** The website Storybook (docs pages, code, props tables). Same stories as the phone one in .rnstorybook. */
const main: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      modulesToTranspile: ["expo-haptics", "expo-blur", "expo-modules-core"],
      pluginReactOptions: {
        babel: {
          plugins: [
            [
              "react-native-unistyles/plugin",
              { root: "src", autoProcessPaths: ["@okoli/ui"], autoProcessImports: ["@okoli/ui"] },
            ],
            "react-native-worklets/plugin",
          ],
        },
      },
    },
  },
  viteFinal: (config) => ({
    ...config,
    define: { ...config.define, "process.env.EXPO_OS": JSON.stringify("web") },
  }),
};

export default main;
