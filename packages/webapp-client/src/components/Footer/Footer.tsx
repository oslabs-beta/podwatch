import React from 'react';

import GitHubIcon from '@mui/icons-material/GitHub';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';

import styles from './Footer.module.scss';

import Link from 'next/link';

import logo from '/public/images/logo/512.png';
import Alex from '/public/images/team/Alex.jpg';
import Andrew from '/public/images/Team/Andrew.jpg';
import Katherine from '/public/images/Team/Katherine.png';
import Maria from '/public/images/Team/Maria.png';
import Roy from '/public/images/Team/Roy.jpg';

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.desktop}>
          <div className={styles.logo}>
          </div>
          <div className={styles.teamLinks}>
            <div className={styles.teamLink}>
              <img draggable={false} src={Alex.src} alt="Alex" />
              <Link href="https://github.com/WVAviator" target="_blank">
                <GitHubIcon /> /WVAviator
              </Link>

              <Link
                href="https://www.linkedin.com/in/wvaviator/"
                target="_blank"
              >
                <LinkedInIcon /> /wvaviator/
              </Link>
              <Link href="https://www.wvaviator.com" target="_blank">
                <PublicIcon /> wvaviator
              </Link>
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Andrew.src} alt="Andrew" />
              <Link href="https://github.com/drewluu" target="_blank">
                <GitHubIcon /> /drewluu
              </Link>
              <Link
                href="https://www.linkedin.com/in/andrew-luu-143113b5/"
                target="_blank"
              >
                <LinkedInIcon /> /andrew-luu-143113b5/
              </Link>
              <p>
                <EmailIcon /> drewluu24@gmail.com
              </p>
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Katherine.src} alt="Katherine" />
              <Link href="https://github.com/kmarrow1" target="_blank">
                <GitHubIcon /> /kmarrow1
              </Link>
              <Link
                href="http://www.linkedin.com/in/katherine-marrow-668a8a1a6"
                target="_blank"
              >
                <LinkedInIcon /> /katherine-marrow
              </Link>
              <p><EmailIcon /> kmcromer1@gmail.com</p> 
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Maria.src} alt="Maria" />
              <Link href="https://github.com/mashkn" target="_blank">
                <GitHubIcon />
                /mashkn
              </Link>
              <Link
                href="https://www.linkedin.com/in/mariyanovok/"
                target="_blank"
              >
                <LinkedInIcon /> /mariyanovok/
              </Link>
              <p><EmailIcon /> mariya.novokhatska@gmail.com</p>
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Roy.src} alt="Roy" />
              <Link href="https://github.com/Hidinkyu" target="_blank">
                <GitHubIcon />
                /Hidinkyu
              </Link>
              <Link href="https://www.linkedin.com/in/roysbae/" target="_blank">
                <LinkedInIcon /> /roysbae/
              </Link>
              <p><EmailIcon /> roybae@gmail.com</p>
            </div>
          </div>
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
