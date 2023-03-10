import React from 'react';
import ClusterManagement from '../../components/ClusterManagementContent/ClusterManagement';
import SidebarContent from '../../components/SidebarContent/SidebarContent';
import useAuthenticate from '../../hooks/useAuthenticate';

const ClusterManagementPage = () => {
  useAuthenticate('/signin');

  return (
    <SidebarContent pageName="All Clusters">
      <ClusterManagement />
    </SidebarContent>
  );
};

export default ClusterManagementPage;
