import React from 'react';
import styles from './Docs.module.scss';

interface DocsProps {
  children: React.ReactNode;
}

const Docs: React.FC<DocsProps> = ({ children }) => {
  return <div className={styles.docs}>{children}</div>;
};

export default Docs;
