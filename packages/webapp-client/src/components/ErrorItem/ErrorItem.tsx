import React from 'react';
import { KError } from '../../types/KError';
import { KErrorInformation } from '../../hooks/useErrorInformation';

interface ErrorItemProps {
  error: KError;
  info: KErrorInformation | null;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error, info }) => {
  return (
    <div>
      <h3>{error.reason}</h3>
      <p>{error.message}</p>
      <p>{info?.description ?? 'No additional information for error'}</p>
    </div>
  );
};

export default ErrorItem;
