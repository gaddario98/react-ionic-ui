import { useCallback } from "react";

export const useFilterOptions = (
  displayedOptions: Array<{
    label: string;
    value: string | number;
    keys?: string[];
  }>
) => {
  return useCallback(
    (filter: string='') => {
      if (!displayedOptions?.length) return [];
      if (!filter?.trim()) return displayedOptions;
      const searchWords = filter.toLowerCase().split(" ").filter(Boolean);
      return displayedOptions.filter((option) => {
        const labelWords = option.label.toLowerCase().split(" ");
        const keysWords = option.keys
          ? option.keys.flatMap((key) => key.toLowerCase().split(" "))
          : [];
        const allWords = [...labelWords, ...keysWords];
        return searchWords.some((word) =>
          allWords.some((optWord) => optWord.includes(word))
        );
      });
    },
    [displayedOptions]
  );
};
