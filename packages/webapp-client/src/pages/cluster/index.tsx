import React, { useEffect } from 'react';
import ClusterManagement from '../../components/ClusterManagementContent/ClusterManagement';
import SidebarContent from '../../components/SidebarContent/SidebarContent';
import useAuthenticate from '../../hooks/useAuthenticate';
import axios, { AxiosInstance } from 'axios';
import serverInstance from '../../utils/serverInstance';

const ClusterManagementPage = () => {
  useAuthenticate('/signin');

  return (
    <SidebarContent pageName="All Clusters">
      <ClusterManagement />
    </SidebarContent>
  );
};

export default ClusterManagementPage;
