import { GetServerSideProps, NextPage } from 'next';
import useSWR from 'swr';
import ErrorLog from '../../components/ErrorLog/ErrorLog';
import SidebarContent from '../../components/SidebarContent/SidebarContent';
import useAuthenticate from '../../hooks/useAuthenticate';
import { Cluster } from '../../types/Cluster';
import { KError } from '../../types/KError';
import serverInstance, { serverFetcher } from '../../utils/serverInstance';

interface DashboardPageProps {
  clusterId: string;
}

const Dashboard: NextPage<DashboardPageProps> = ({ clusterId }) => {
  useAuthenticate('/signin');
  const { data: cluster } = useSWR(`/cluster/${clusterId}`, serverFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (!cluster) {
    return null;
  }

  return (
    <SidebarContent pageName={cluster.name}>
      <ErrorLog clusterId={clusterId} />
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

  return {
    props: {
      clusterId,
    },
  };
};

export default Dashboard;
