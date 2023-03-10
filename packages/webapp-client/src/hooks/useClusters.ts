import React from 'react';
import { Cluster } from '../types/Cluster';
import serverInstance from '../utils/serverInstance';

const useClusters = () => {
  const [clusters, setClusters] = React.useState<Cluster[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchClusters = async () => {
      const { data } = await serverInstance.get<Cluster[]>('/cluster');
      setClusters(data);
      setLoading(false);
    };
    fetchClusters();
  }, []);

  return { clusters, loading };
};

export default useClusters;
