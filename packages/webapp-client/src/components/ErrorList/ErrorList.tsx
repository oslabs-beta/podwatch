import React from 'react';
import useErrorInformation from '../../hooks/useErrorInformation';
import { KError } from '../../types/KError';
import ErrorItem from '../ErrorItem/ErrorItem';

interface ErrorListProps {
  initialErrors: KError[];
  clusterId: string;
}

const ErrorList: React.FC<ErrorListProps> = ({ initialErrors, clusterId }) => {
  const [errors, setErrors] = React.useState(initialErrors);
  const { getErrorInformation, loading } = useErrorInformation();

  React.useEffect(() => {
    const getErrors = async () => {
      const response = await fetch('/api/errors', {
        method: 'GET',
        headers: {
          clusterId,
          'Content-Type': 'application/json',
        },
      });
      const errors = await response.json();
      setErrors(errors);
    };
    getErrors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {errors.map((error) => {
          const info = getErrorInformation(error.reason);
          return <ErrorItem key={error.id} error={error} info={info} />;
        })}
      </ul>
    </div>
  );
};

export default ErrorList;
