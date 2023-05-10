import React from 'react';
import styles from './PageContent.module.scss';

interface PageContentProps {
  children: React.ReactNode;
}

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return <section className={styles.layout}>{children}</section>;
};

export default PageContent;
