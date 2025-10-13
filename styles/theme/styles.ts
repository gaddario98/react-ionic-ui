
export const theme = {
  light: {
    colors: {
      primary: {
        DEFAULT: '#2196F3',
        text: 'text-blue-600',
        bg: 'bg-blue-600',
        hover: 'hover:bg-blue-700',
        container: 'bg-blue-50',
        onContainer: 'text-blue-950',
        onTextBg: 'text-white', // Colore chiaro per leggibilità su sfondo primary
      },
      secondary: {
        DEFAULT: '#0D47A1',
        text: 'text-blue-900',
        bg: 'bg-blue-900',
        hover: 'hover:bg-blue-950',
        container: 'bg-blue-100',
        onContainer: 'text-blue-950',
        onTextBg: 'text-white', // Colore chiaro per leggibilità su sfondo secondary
      },
      tertiary: {
        DEFAULT: '#03A9F4',
        text: 'text-blue-500',
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        container: 'bg-blue-50', 
        onContainer: 'text-blue-950',
        onTextBg: 'text-white', // Colore chiaro per leggibilità su sfondo tertiary
      },
      error: {
        DEFAULT: '#ba1a1a',
        text: 'text-red-600',
        bg: 'bg-red-600',
        hover: 'hover:bg-red-700',
        container: 'bg-red-100',
        onContainer: 'text-red-950',
        onTextBg: 'text-white', // Colore chiaro per leggibilità su sfondo error
      },
      surface: {
        DEFAULT: '#ffffff',
        text: 'text-gray-900',
        bg: 'bg-white',
        variant: 'bg-blue-50',
        onVariant: 'text-white',
        onTextBg: 'text-gray-900', // Colore scuro per leggibilità su sfondo surface
      },
      outline: {
        DEFAULT: '#64B5F6',
        variant: 'border-blue-200',
        onTextBg: 'text-blue-900', // Colore che contrasta con outline
      },
      shadow: 'shadow-gray-900',
      elevation: {
        0: 'shadow-none bg-transparent',
        1: 'shadow-sm bg-blue-50',
        2: 'shadow bg-blue-100',
        3: 'shadow-md bg-blue-200',
        4: 'shadow-lg bg-blue-300',
        5: 'shadow-xl bg-blue-400'
      }
    }
  },
  dark: {
    colors: {
      primary: {
        DEFAULT: '#90CAF9',
        text: 'text-blue-300',
        bg: 'bg-blue-300',
        hover: 'hover:bg-blue-400',
        container: 'bg-blue-600',
        onContainer: 'text-blue-50',
        onTextBg: 'text-blue-950', // Colore scuro per leggibilità su sfondo primary (chiaro nel tema dark)
      },
      secondary: {
        DEFAULT: '#82B1FF',
        text: 'text-blue-300',
        bg: 'bg-blue-300',
        hover: 'hover:bg-blue-400',
        container: 'bg-blue-600', 
        onContainer: 'text-blue-50',
        onTextBg: 'text-blue-950', // Colore scuro per leggibilità su sfondo secondary
      },
      tertiary: {
        DEFAULT: '#81D4FA',
        text: 'text-blue-200',
        bg: 'bg-blue-200',
        hover: 'hover:bg-blue-300',
        container: 'bg-blue-600',
        onContainer: 'text-blue-50',
        onTextBg: 'text-blue-950', // Colore scuro per leggibilità su sfondo tertiary
      },
      error: {
        DEFAULT: '#ffb4ab',
        text: 'text-red-300',
        bg: 'bg-red-300',
        hover: 'hover:bg-red-400',
        container: 'bg-red-800',
        onContainer: 'text-red-200',
        onTextBg: 'text-red-950', // Colore scuro per leggibilità su sfondo error
      },
      surface: {
        DEFAULT: '#001F29',
        text: 'text-blue-50',
        bg: 'bg-blue-950',
        variant: 'bg-gray-700', 
        onVariant: 'text-blue-50',
        onTextBg: 'text-blue-50', // Colore chiaro per leggibilità su sfondo surface (scuro nel tema dark)
      },
      outline: {
        DEFAULT: '#64B5F6',
        variant: 'border-gray-600',
        onTextBg: 'text-blue-200', // Colore che contrasta con outline nel tema dark
      },
      shadow: 'shadow-black',
      elevation: {
        0: 'shadow-none bg-transparent',
        1: 'shadow-sm bg-blue-950',
        2: 'shadow bg-blue-900',
        3: 'shadow-md bg-blue-800',
        4: 'shadow-lg bg-blue-700',
        5: 'shadow-xl bg-blue-600'
      }
    }
  }
} as const;
  
  export type ThemeMode = keyof typeof theme;
  export type ColorVariant = keyof typeof theme.light.colors;
  export type ElevationLevel = keyof typeof theme.light.colors.elevation;