import React from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import { Switch } from '@mui/material';
import styles from './DarkModeToggle.module.scss';
import useThemingTools from '../../hooks/useThemingTools';

const DarkModeToggle = () => {
  const { toggleColorMode, colorMode } = useThemingTools();

  return (
    <div className={styles.container}>
      {colorMode === 'light' ? <WbSunnyIcon /> : <ModeNightIcon />}
      <Switch
        checked={colorMode === 'dark'}
        color="secondary"
        onChange={toggleColorMode}
      />
    </div>
  );
};

export default DarkModeToggle;
