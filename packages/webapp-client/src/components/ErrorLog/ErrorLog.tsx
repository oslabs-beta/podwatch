import { CircularProgress } from '@mui/material';
import React from 'react';
import useErrorInformation from '../../hooks/useErrorInformation';
import useErrors from '../../hooks/useErrors';
import { KError } from '../../types/KError';
import ErrorItem from '../ErrorItem/ErrorItem';
import OverlapSpacer from '../OverlapSpacer/OverlapSpacer';
import styles from './ErrorLog.module.scss';
import { mockKErrors } from './mockKErrors';

interface ErrorLogProps {
  clusterId: string;
}

const ErrorLog: React.FC<ErrorLogProps> = ({ clusterId }) => {
  const { getErrorInformation, loading } = useErrorInformation();
  const { errors } = useErrors(clusterId);

  if (loading || !errors) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <OverlapSpacer className={styles.spacer}>
      <ul className={styles.container}>
        {errors.map((error) => {
          const info = getErrorInformation(error.reason);
          return <ErrorItem key={error.id} error={error} info={info} />;
        })}
      </ul>
    </OverlapSpacer>
  );
};

export default ErrorLog;
