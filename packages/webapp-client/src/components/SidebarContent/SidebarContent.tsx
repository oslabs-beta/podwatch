import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './SidebarContent.module.scss';

const SidebarContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default SidebarContent;
