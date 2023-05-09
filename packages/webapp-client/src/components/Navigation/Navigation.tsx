import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import styles from './Navigation.module.scss';
import Hamburger from '../Hamburger/Hamburger';

interface NavigationItem {
  href: string;
  visible: 'all' | 'desktop' | 'mobile';
  component: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

interface NavigationProps {
  items: NavigationItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={styles.desktop}>
        {items
          .filter((item) => item.visible !== 'mobile')
          .map((item, i) => (
            <Link key={i} href={item.href} className={styles.link}>
              {item.component && React.cloneElement(item.component)}
            </Link>
          ))}
      </div>
      <div className={styles.mobile}>
        <Hamburger open={open} setOpen={setOpen} />
        <div
          className={`${styles.menu} ${
            open ? styles.menuOpen : styles.menuClosed
          }`}
        >
          {items
            .filter((item) => item.visible !== 'desktop')
            .map((item, i) => (
              <Link key={i} href={item.href} className={styles.link}>
                <li className={styles.item}>
                  {React.cloneElement(item.component)}
                </li>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
