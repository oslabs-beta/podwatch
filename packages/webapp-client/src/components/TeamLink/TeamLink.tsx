import React from 'react';
import Link from 'next/link';
import styles from './TeamLink.module.scss'

import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PublicIcon from '@mui/icons-material/Public';

interface TeamLinkProps {
  image: string;
  github: string;
  linkedin: string;
  personal: string;
}

const TeamLink: React.FC<TeamLinkProps> = ({
  image,
  github,
  linkedin,
  personal,
}) => {
  return (
    <div className={styles.teamLink}>
      <img draggable={false} src={image} alt="Alex" />
      <div className={styles.Link}>
        <Link href={github} target="_blank">
          <GitHubIcon />
        </Link>
        <Link href={linkedin} target="_blank">
          <LinkedInIcon />
        </Link>
        <Link href={`mailto:${personal}`} target="_blank">
          {personal.includes('@') ? <EmailIcon /> : <PublicIcon />}
        </Link>
      </div>
    </div>
  );
};

export default TeamLink;
