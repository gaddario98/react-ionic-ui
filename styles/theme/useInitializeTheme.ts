import { useCallback, useEffect } from "react";
import { useThemeState } from "@gaddario98/react-ionic-ui";

export const useInitializeTheme = () => {
  const [{ theme }, setTheme] = useThemeState();

  const onThemeModeChange = useCallback(
    (mediaQuery: MediaQueryListEvent, theme: "light" | "dark") => {
      if (mediaQuery.matches) {
        setTheme({ theme });
      }
    },
    [setTheme]
  );

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const lightModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: light)"
    );

    darkModeMediaQuery.addEventListener("change", (mediaQuery) =>
      onThemeModeChange(mediaQuery, "dark")
    );
    lightModeMediaQuery.addEventListener("change", (mediaQuery) =>
      onThemeModeChange(mediaQuery, "light")
    );

    return () => {
      darkModeMediaQuery.removeEventListener("change", (mediaQuery) =>
        onThemeModeChange(mediaQuery, "dark")
      );

      lightModeMediaQuery.removeEventListener("change", (mediaQuery) =>
        onThemeModeChange(mediaQuery, "light")
      );
    };
  }, []);

  const getThemeFromLink = useCallback(() => {
    const themeLink = document.getElementById("theme-link");
    if (themeLink) {
      const href = themeLink.getAttribute("href");
      return href;
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "ion-palette-dark",
      theme !== "light"
    );
    document.body.classList.toggle("dark", theme !== "light");
  }, [theme, getThemeFromLink]);
};
