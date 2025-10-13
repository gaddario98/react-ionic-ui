import { atomStateGenerator } from "@gaddario98/react-state";

const {
  atom: themeAtom,
  useValue: useThemeValue,
  useState: useThemeState,
} = atomStateGenerator<{ theme: "dark" | "light" }>({
  defaultValue: { theme: "light" },
  key: "theme",
  persist: true,
});
export * from "./styles";
export * from "./useInitializeTheme";
export { themeAtom, useThemeValue, useThemeState };
