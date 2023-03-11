import { Button, FormControlLabel, Switch } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <>
      <div className={styles.spacer}></div>
      <header className={styles.header}>
        <div className={styles.contents}>
          <Button href='/'><Logo /></Button>
          <Navigation
            items={[
              { label: 'Sign In', href: '/auth/signin', visible: 'mobile' },
              { label: 'Docs', href: '/', visible: 'all' },
              { label: 'Examples', href: '/', visible: 'all' },
              { label: 'GitRepo', href: '/', visible: 'all' },
            ]}
          />
          <div className={styles.corner}>
            <div className={styles.signin}>
              <Link href="/auth/signin">
                <Button variant="contained" color="secondary">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className={styles.divider} />
            <div className={styles.toggle}>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
