import { useTheme } from '@mui/system';
import React from 'react';
import { ColorModeContext } from '../context/ThemeProvider/ThemeProvider';

const useThemingTools = () => {
  const { toggleColorMode } = React.useContext(ColorModeContext);
  const colorMode = useTheme().palette.mode;
  return { toggleColorMode, colorMode };
};

export default useThemingTools;
