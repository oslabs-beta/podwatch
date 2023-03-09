import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './SidebarContent.module.scss';

interface SidebarContentProps {
  children: React.ReactNode;
  pageName?: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  pageName = 'All Clusters',
}) => {
  return (
    <div className={styles.container}>
      <Sidebar pageName={pageName} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default SidebarContent;
