import React from 'react';
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
      </div>
    </header>
  );
};

export default Header;
