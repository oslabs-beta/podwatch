import { Button, FormControlLabel, Switch } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.contents}>
        <Logo />
        <Navigation
          items={[
            { label: 'Docs', href: '/' },
            { label: 'Examples', href: '/' },
            { label: 'GitRepo', href: '/' },
          ]}
        />
        <div className={styles.signin}>
          <Link href="/">
            <Button variant="contained" color="secondary">
              Sign In
            </Button>
          </Link>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.toggle}>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
