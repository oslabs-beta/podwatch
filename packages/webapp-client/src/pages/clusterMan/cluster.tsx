import React from 'react';
import ClusterManagement from '../../components/ClusterManagementContent/ClusterManagement';
import { User } from '../../types/User';

interface clusterManProps {
  owner: User;
}
export default function clusterman() {
  return (
    <>
      <ClusterManagement />
    </>
  );
}
