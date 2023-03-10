import { Avatar, Button, FormControlLabel, Switch } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import useAuthenticate from '../../hooks/useAuthenticate';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.scss';

const Header = () => {
  const { user, setUser } = useAuthenticate();

  const getUserAvatar = () => {
    if (!user) {
      return (
        <Link href="/auth/signin">
          <Button
            variant="contained"
            color="secondary"
            sx={{ minWidth: '6rem' }}
          >
            Sign In
          </Button>
        </Link>
      );
    }
    const { email, avatar } = user;
    const userName = email.split('@')[0];
    if (avatar) {
      return <Avatar alt={userName} src={avatar} />;
    }
    return <Avatar alt={userName}>{userName[0].toLocaleUpperCase()}</Avatar>;
  };

  return (
    <>
      <div className={styles.spacer}></div>
      <header className={styles.header}>
        <div className={styles.contents}>
          <Link href="/">
            <Logo />
          </Link>
          <Navigation
            items={[
              { label: 'Docs', href: '/', visible: 'all' },
              { label: 'Examples', href: '/', visible: 'all' },
              { label: 'GitRepo', href: '/', visible: 'all' },
            ]}
          />
          <div className={styles.corner}>
            <div className={styles.signin}>{getUserAvatar()}</div>
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
