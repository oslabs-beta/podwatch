import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import ErrorLog from '../../components/ErrorLog/ErrorLog';
import { Cluster } from '../../types/Cluster';
import { KError } from '../../types/KError';

interface DashboardPageProps {
  cluster: Cluster;
  kErrors: KError[];
}

const Dashboard: NextPage<DashboardPageProps> = ({ cluster, kErrors }) => {
  return (
    <div>
      <ErrorLog initialErrors={kErrors} clusterId={cluster.id} />
    </div>
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
