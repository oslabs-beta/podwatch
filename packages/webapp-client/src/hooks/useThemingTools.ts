import { useTheme } from '@mui/system';
import React from 'react';
import { ColorModeContext } from '../context/ThemeProvider/ThemeProvider';

/**
 * Provides information and functions to dynamically change the theme
 * @returns toggleColorMode - function to toggle between light and dark mode
 * @returns colorMode - current color mode (light or dark)
 */
const useThemingTools = () => {
  const { toggleColorMode } = React.useContext(ColorModeContext);
  const colorMode = useTheme().palette.mode;
  return { toggleColorMode, colorMode };
};

export default useThemingTools;
