module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "react-native-unistyles/plugin",
        {
          root: "src",
          // @okoli/ui lives in node_modules, which the plugin skips (any consuming app needs this too).
          autoProcessPaths: ["@okoli/ui"],
          // Stories and the Storybook preview sit outside `root`; they all import the kit.
          autoProcessImports: ["@okoli/ui"],
        },
      ],
    ],
  };
};
