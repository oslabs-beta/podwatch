import React from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Switch } from '@mui/material';
import styles from './DarkModeToggle.module.scss';

const DarkModeToggle = () => {
  return (
    <div className={styles.container}>
      <WbSunnyIcon />
      <Switch defaultChecked color="secondary" />
    </div>
  );
};

export default DarkModeToggle;
