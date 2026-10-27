// Themes must be registered before anything reads a StyleSheet from @okoli/ui.
import "./src/unistyles";
import { registerRootComponent } from "expo";
import StorybookUIRoot from "./.rnstorybook";

registerRootComponent(StorybookUIRoot);
