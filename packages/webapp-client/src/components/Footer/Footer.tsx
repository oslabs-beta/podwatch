import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import styles from './Footer.module.scss';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.desktop}>
          
        </div>
        <div className={styles.link}>
          <Link href="/">
            <GitHubIcon className={styles.icon} />
          </Link>
          <p className={styles.iconText}>Github</p>
        </div>
        <div className={styles.link}>
          <Link href="/">
            <AutoStoriesIcon className={styles.icon} />
          </Link>
          <p className={styles.iconText}>Docs</p>
        </div>
        <div className={styles.link}>
          <Link href="/">
            <PeopleAltIcon className={styles.icon} />
          </Link>
          <p className={styles.iconText}>The Team</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
