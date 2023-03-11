import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import styles from './Navigation.module.scss';

interface NavigationItem {
  label: string;
  href: string;
  visible: 'all' | 'desktop' | 'mobile';
}

interface NavigationProps {
  items: NavigationItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (open) {
      setAnchorEl(null);
      return;
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.desktop}>
      {items
        .filter((item) => item.visible !== 'mobile')
        .map((item) => (
          <Link key={item.label} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}
    </div>
  );
};

export default Navigation;
