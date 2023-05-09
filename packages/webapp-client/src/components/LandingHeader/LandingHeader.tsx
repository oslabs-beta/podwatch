import React from 'react';
import styles from './LandingHeader.module.scss';

interface LandingHeaderProps {
  children: React.ReactNode;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ children }) => {
  return <div className={styles.layout}>{children}</div>;
};

export default LandingHeader;
