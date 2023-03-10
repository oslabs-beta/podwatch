import useSWR from 'swr';
import serverInstance, { serverFetcher } from '../utils/serverInstance';
import { KError } from '../types/KError';

const useErrors = (clusterId: string) => {
  const { data, error, isLoading } = useSWR<KError[]>(
    `/kerrors/${clusterId}`,
    serverFetcher,
    {
      refreshInterval: 5000,
    }
  );

  return {
    errors: data,
    isLoading,
    error,
  };
};

export default useErrors;
