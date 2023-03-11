import React from 'react';
import ClusterCreateForm from '../../components/ClusterCreateForm/ClusterCreateForm';
import SidebarContent from '../../components/SidebarContent/SidebarContent';
import serverInstance from '../../utils/serverInstance';

const CreateClusterPage = () => {
  return (
    <SidebarContent pageName="Create Cluster">
      <ClusterCreateForm />
    </SidebarContent>
  );
};

export default CreateClusterPage;
