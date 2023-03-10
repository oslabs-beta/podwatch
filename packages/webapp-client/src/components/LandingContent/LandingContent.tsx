import React from 'react';
import styles from './LandingContent.module.scss';
import { Chip } from '@mui/material';
import Image from 'next/image';
import codeSmith from '/public/images/logo/code-smith.png';
import osLabs from '/public/images/logo/os-labs.png';
import logo from '/public/images/logo/512.png';
import Link from 'next/link';
import OverlapSpacer from '../OverlapSpacer/OverlapSpacer';

const LandingContent: React.FC = () => {
  return (
    <div className={styles.Landing}>
      <OverlapSpacer className={styles.LandingContent}>
        <div className={styles.text}>
          <h1 className={styles.title}>PodWatch</h1>
          <h1>Kubernetes Error Hub</h1>
          <p>Streamline your Kubernetes monitoring with Pod Watch</p>
          <br />
          <Chip label="V0.0.1" color="primary" />
        </div>
        <Image
          draggable={false}
          className={styles.logo}
          src={logo}
          alt="podWatch"
        />
        <span className={styles.logoBox}>
          <h3>
            Contributing <br /> Organizations
          </h3>
          <span className={styles.schools}>
            <Link href="/">
              <Image
                draggable={false}
                className={styles.schoolLogo}
                src={codeSmith}
                alt="CodeSmith"
              />
            </Link>
            <Link href="/">
              <Image
                draggable={false}
                className={styles.schoolLogo}
                src={osLabs}
                alt="OSLabs"
              />
            </Link>
          </span>
        </span>
      </OverlapSpacer>
    </div>
  );
};

export default LandingContent;
