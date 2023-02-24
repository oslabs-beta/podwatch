import variables from '@/styles/exports.module.scss';
import {
  createTheme,
  PaletteMode,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import React, { PropsWithChildren } from 'react';

/**
 * This context is used to toggle the color mode state between light or dark by any component in the app.
 */
export const ColorModeContext = React.createContext<{
  toggleColorMode: () => void;
}>({
  toggleColorMode: () => {},
});

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: variables.colorPrimary,
          },
          secondary: {
            main: variables.colorSecondary,
          },
        }
      : {
          // palette values for dark mode (they're mostly the same now but we can adjust this later)
          primary: {
            main: variables.colorPrimary,
          },
          secondary: {
            main: variables.colorSecondary,
          },
          text: {
            primary: '#fff',
            secondary: '#d8d8d8',
          },
        }),
  },
  typography: {
    fontFamily: variables.fontMain,
  },
});

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  //TODO: Get the mode from the user's preferences or from the browser
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light'
        );
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;
