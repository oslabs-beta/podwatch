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
            sx={{ minWidth: '6rem', borderRadius: '20px', height: '2.5rem' }}
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
              { component: <>Docs</>, href: '/docs', visible: 'all' },
              { component: <>Clusters</>, href: '/cluster', visible: 'all' },
              {
                component: <>Repository</>,
                href: 'https://github.com/oslabs-beta/podwatch',
                visible: 'all',
              },
              {
                component: getUserAvatar(),
                href: '/auth/signin',
                visible: 'all',
              },
            ]}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
