import React from 'react';
import styles from './LandingContent.module.scss';
import { Chip } from '@mui/material';
import Image from 'next/image';
import codeSmith from '/public/images/logo/code-smith.png';
import osLabs from '/public/images/logo/os-labs.png';
import logo from '/public/images/logo/256.png';

const LandingContent: React.FC = () => {
  return (
    <div className={styles.LandingContent}>
      <div className={styles.text}>
        <h1>PodWatch</h1>
        <h1>Kubernetes Error Hub</h1>
        <Chip label="V0.0.1" color="primary" />
      </div>
      <Image className={styles.logo} src={logo} alt="podWatch" />
      <span className={styles.logoBox}>
        <Image className={styles.schoolLogo} src={codeSmith} alt="CodeSmith" />
        <Image className={styles.schoolLogo} src={osLabs} alt="OSLabs" />
      </span>
    </div>
  );
};

export default LandingContent;
