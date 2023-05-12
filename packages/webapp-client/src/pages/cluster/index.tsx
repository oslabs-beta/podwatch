import React from 'react';
import ClusterManagement from '../../components/ClusterManagementContent/ClusterManagement';
import SidebarContent from '../../components/SidebarContent/SidebarContent';
import useAuthenticate from '../../hooks/useAuthenticate';
import PageContent from '../../components/PageContent/PageContent';
import useClusters from '../../hooks/useClusters';
import { CircularProgress } from '@mui/material';
import Accordion from '../../components/Accordion/Accordion';
import ClusterCreateForm from '../../components/ClusterCreateForm/ClusterCreateForm';
import Link from 'next/link';

const ClusterManagementPage = () => {
  useAuthenticate('/signin');
  const { clusters, loading } = useClusters();

  return (
    <PageContent>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          {clusters.map((cluster) => (
            <>
              <Link href={`/dashboard/${cluster.id}`}>
                <Accordion title={cluster.name}>
                  <div>{cluster.description}</div>
                </Accordion>
              </Link>
              <br />
            </>
          ))}
          <Accordion title="Add New">
            <ClusterCreateForm />
          </Accordion>
        </div>
      )}
    </PageContent>
  );
};

export default ClusterManagementPage;
