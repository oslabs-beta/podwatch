import React from 'react';
import Link from 'next/link';
import styles from './TeamLink.module.scss';

import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PublicIcon from '@mui/icons-material/Public';

interface TeamLinkProps {
  image: string;
  name: string;
  github?: string;
  linkedin?: string;
  personal?: string;
  email?: string;
}

const TeamLink: React.FC<TeamLinkProps> = ({
  image,
  name,
  github,
  linkedin,
  personal,
  email,
}) => {
  return (
    <div className={styles.teamLink}>
      <img draggable={false} src={image} alt={name} />
      <h2>{name}</h2>
      <div className={styles.Link}>
        {github && (
          <Link href={github} target="_blank">
            <GitHubIcon />
          </Link>
        )}
        {linkedin && (
          <Link href={linkedin} target="_blank">
            <LinkedInIcon />
          </Link>
        )}
        {personal && (
          <Link href={personal} target="_blank">
            <PublicIcon />
          </Link>
        )}
        {email && (
          <Link href={`mailto:${email}`} target="_blank">
            <EmailIcon />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TeamLink;
