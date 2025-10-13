export const typography = {
  // Font families
  fontFamily: {
    regular: "",
    medium: "",
    light: "",
  },

  // Text styles
  text: {
    header: "!text-xl md:!text-2xl font-semibold", // Titoli principali
    sectionTitle: "!text-xl md:!text-2xl font-semibold", // Titoli delle sezioni
    sectionSubtitle: "!text-lg md:!text-xl font-normal", // Sottotitoli
    cardTitle: "!text-lg md:!text-xl font-semibold", // Titoli delle card
    cardSubtitle: "!text-base md:!text-lg font-normal", // Sottotitoli delle card
    listItemTitle: "!text-base md:!text-lg font-normal", // Elementi di lista
    listItem: "!text-sm md:!text-lg font-normal", // Elementi di lista
    input: "!text-base md:!text-base font-normal", // Campi input
    floatLabel: "!text-xs md:!text-sm font-normal", // Campi input
    paragraph: "!text-base text-gray-500", // Paragrafi
    tabLabel: "!text-sm md:!text-base font-medium text-primary", // Etichette delle schede
    button: "!text-base",
  },

  // Icon sizes
  icon: {
    title: "w-6 h-6", // ~23px
  },

  // Text truncation
  truncate: "truncate ion-text-nowrap max-w-full",
} as const;

export type TypographyKey = keyof typeof typography;
