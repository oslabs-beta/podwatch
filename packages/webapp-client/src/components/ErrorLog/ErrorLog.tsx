import React from 'react';
import useErrorInformation from '../../hooks/useErrorInformation';
import { KError } from '../../types/KError';
import ErrorItem from '../ErrorItem/ErrorItem';
import OverlapSpacer from '../OverlapSpacer/OverlapSpacer';
import styles from './ErrorLog.module.scss';

interface ErrorLogProps {
  initialErrors: KError[];
  clusterId: string;
}

const ErrorLog: React.FC<ErrorLogProps> = ({ initialErrors, clusterId }) => {
  const [errors, setErrors] = React.useState(initialErrors);
  const { getErrorInformation, loading } = useErrorInformation();

  React.useEffect(() => {
    const getErrors = async () => {
      // const response = await fetch('http://localhost:3001/errors', {
      //   method: 'GET',
      //   headers: {
      //     clusterId,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const errors = await response.json();
      // setErrors(errors);
    };
    getErrors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
