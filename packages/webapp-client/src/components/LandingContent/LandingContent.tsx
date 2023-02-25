import React from 'react';
import styles from './LandingContent.module.scss';
import { Chip } from '@mui/material';
import Image from 'next/image';
import codeSmith from '/public/images/logo/code-smith.png';
import osLabs from '/public/images/logo/os-labs.png';

const LandingContent: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>PodWatch</h2>
      <h1>Kubernetes Error Hub</h1>
      <Chip label="V0.0.1" color="primary" />
      <span className="imgs">
        <Image className={styles.logo} src={codeSmith} alt="CodeSmith" />
        <Image className={styles.logo} src={osLabs} alt="OSLabs" />
      </span>
    </div>
  );
};

export default LandingContent;
