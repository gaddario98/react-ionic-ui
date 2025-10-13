export const layout = {
  // Layout constants
  spacing: {
    padding: "p-4", // 16px
    paddingY: "py-4", // 16px
    paddingMinY: "py-2", // 16px
    gap: "gap-2.5", // 10px
  },

  // Layout styles
  page: "flex grow gap-2.5 ion-padding flex-col  min-h-full",
  footer: "flex flex-col gap-2.5",
  content: "flex flex-col gap-1.5",
  contents: "flex flex-col gap-2",
  contentRow: "flex items-center gap-1.5 flex-row",
  paragraph: "px-4",
  paragraphContent: "flex flex-col first:gap-2 not-first:gap-2.5",

  // Container styles
  container: {
    base: "w-full mx-auto",
    padding: "px-4",
    maxWidth: "max-w-7xl",
  },
} as const;
export type LayoutKey = keyof typeof layout;
