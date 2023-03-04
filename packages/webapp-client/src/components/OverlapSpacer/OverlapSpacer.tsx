import React from 'react';
import styles from './OverlapSpacer.module.scss';

interface OverlapSpacerProps {
  children: React.ReactNode;
  className?: string;
}

const OverlapSpacer: React.FC<OverlapSpacerProps> = ({
  children,
  className,
}) => {
  return (
    <>
      <div className={styles.spacer}></div>
      <div className={`${styles.content} ${className}`}>{children}</div>
    </>
  );
};

export default OverlapSpacer;
