declare module "next-themes" {
  export interface UseThemeProps {
    themes?: string[];
    defaultTheme?: string;
    forcedTheme?: string;
    storageKey?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }

  export interface ThemeProviderProps extends UseThemeProps {
    children: React.ReactNode;
    attribute?: string;
  }

  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    themes: string[];
    systemTheme: string | undefined;
  };

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}
