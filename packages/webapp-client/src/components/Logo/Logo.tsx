import Image from 'next/image';
import React from 'react';
import logoImage from '/public/images/logo/64.png';
import styles from './Logo.module.scss';

const Logo = () => {
  return (
    <div className={styles.container}>
      <Image src={logoImage} alt="Logo" width={64} height={64} />
      <span className={styles.text}>PodWatch</span>
    </div>
  );
};

export default Logo;
