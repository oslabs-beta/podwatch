import React from 'react';
import styles from './ClusterCard.module.scss';

interface ClusterProps {
  name: string;
  owner: string;
  clID: string;
}

const ClusterCard: React.FC<ClusterProps> = ({ name, owner, clID }) => {
  return (
    <div className={styles.ClusterCard}>
      <div className={styles.header}>
        <p>{name}</p>
      </div>
      <div className={styles.body}>
        <p>{owner}</p>
      </div>
      <div className={styles.footer}>
        <p>{clID}</p>
      </div>
    </div>
  );
};

export default ClusterCard;
