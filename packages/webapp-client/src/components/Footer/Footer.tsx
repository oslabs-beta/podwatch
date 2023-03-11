import React from 'react';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GitHubIcon from '@mui/icons-material/GitHub';

import styles from './Footer.module.scss';

import Link from 'next/link';

import Alex from '/public/images/team/Alex.jpg';
import Andrew from '/public/images/Team/Andrew.jpg';
import Katherine from '/public/images/Team/Katherine.png';
import Maria from '/public/images/Team/Maria.png';
import Roy from '/public/images/Team/Roy.jpg';

import TeamLink from '../TeamLink/TeamLink';

const Footer = () => {
  const teamLinks = [
    {
      name: 'Alex',
      image: Alex.src,
      github: 'https://github.com/WVAviator',
      linkedin: 'https://www.linkedin.com/in/wvaviator/',
      personal: 'https://www.wvaviator.com',
      email: 'wvaviator@gmail.com',
    },
    {
      name: 'Andrew',
      image: Andrew.src,
      github: 'https://github.com/drewluu',
      linkedin: 'https://www.linkedin.com/in/andrew-luu-143113b5/',
      email: 'drewluu24@gmail.com',
    },
    {
      name: 'Katherine',
      image: Katherine.src,
      github: 'https://github.com/',
      linkedin: 'https://www.linkedin.com/in/',
      email: 'kmcromer1@gmail.com',
    },
    {
      name: 'Maria',
      image: Maria.src,
      github: 'https://github.com/mashkn',
      linkedin: 'https://www.linkedin.com/in/mariyanovok/',
      email: 'mariya.novokhatska@gmail.com',
    },
    {
      name: 'Roy',
      image: Roy.src,
      github: 'https://github.com/Hidinkyu',
      linkedin: 'https://www.linkedin.com/in/roysbae/',
      email: 'roysbae@gmail.com',
    },
  ];
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.desktop}>
          <div className={styles.logo}></div>
          <div className={styles.teamLinks}>
            {teamLinks.map((link) => (
              <TeamLink
                key={link.name}
                name={link.name}
                image={link.image}
                github={link.github}
                linkedin={link.linkedin}
                personal={link.personal}
                email={link.email}
              />
            ))}

            {/* <div className={styles.teamLink}>
              <img draggable={false} src={Alex.src} alt="Alex" />
              <Link href="https://github.com/WVAviator" target="_blank">
                <GitHubIcon /> 
              </Link>

              <Link
                href="https://www.linkedin.com/in/wvaviator/"
                target="_blank"
              >
                <LinkedInIcon />
              </Link>
              <Link href="https://www.wvaviator.com" target="_blank">
                <PublicIcon /> 
              </Link>
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Andrew.src} alt="Andrew" />
              <Link href="https://github.com/drewluu" target="_blank">
                <GitHubIcon /> 
              </Link>
              <Link
                href="https://www.linkedin.com/in/andrew-luu-143113b5/"
                target="_blank"
              >
                <LinkedInIcon /> 
              </Link>
              <Link href="mailto:drewluu24@gmail.com">
                <EmailIcon /> 
              </Link>
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Katherine.src} alt="Katherine" />
              <Link href="https://github.com/kmarrow1" target="_blank">
                <GitHubIcon />
              </Link>
              <Link
                href="http://www.linkedin.com/in/katherine-marrow-668a8a1a6"
                target="_blank"
              >
                <LinkedInIcon />
              </Link>
              <Link href="mailto:kmcromer1@gmail.com">
                <EmailIcon />
              </Link>
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Maria.src} alt="Maria" />
              <Link href="https://github.com/mashkn" target="_blank">
                <GitHubIcon />
              </Link>
              <Link
                href="https://www.linkedin.com/in/mariyanovok/"
                target="_blank"
              >
                <LinkedInIcon />
              </Link>
              <Link href="mailto:mariya.novokhatska@gmail.com">
                <EmailIcon />
              </Link>
            </div>
            <div className={styles.teamLink}>
              <img draggable={false} src={Roy.src} alt="Roy" />
              <Link href="https://github.com/Hidinkyu" target="_blank">
                <GitHubIcon />
              </Link>
              <Link href="https://www.linkedin.com/in/roysbae/" target="_blank">
                <LinkedInIcon />
              </Link>
              <Link href="roybae@gmail.com">
                <EmailIcon />
              </Link>
            </div> */}
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
