import { Grid, Stack } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import ErrorLog from '../../components/ErrorLog/ErrorLog';
import Sidebar from '../../components/Sidebar/Sidebar';
import SidebarContent from '../../components/SidebarContent/SidebarContent';
import { Cluster } from '../../types/Cluster';
import { KError } from '../../types/KError';

interface DashboardPageProps {
  cluster: Cluster;
  kErrors: KError[];
}

const Dashboard: NextPage<DashboardPageProps> = ({ cluster, kErrors }) => {
  return (
    <SidebarContent>
      <ErrorLog initialErrors={kErrors} clusterId={cluster.id} />
    </SidebarContent>
  );
};

export const getServerSideProps: GetServerSideProps<
  DashboardPageProps
> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const clusterId = params.clusterId as string;

  //TODO: Prefetch cluster data to serve as props
  const cluster: Cluster = {
    id: clusterId,
    name: 'Cluster 1',
    description: 'This is a cluster',
    owner: {
      id: '1',
      email: 'a@a.a',
      provider: 'local',
    },
    members: [],
  };

  const kErrors: KError[] = [];

  return {
    props: {
      cluster,
      kErrors,
    },
  };
};

export default Dashboard;
