import React from 'react';

export interface KErrorInformation {
  /**
   * A human readable name for the error.
   */
  name: string;
  /**
   * A list of Kubernetes events that can cause this error.
   */
  events: string[];
  /**
   * A description of the error, including what can cause it and how to resolve it.
   */
  description: string;
  /**
   * A list of references to Kubernetes documentation or other resources that can help resolve the error.
   */
  references: string[];
}

export interface KErrorInformationMap {
  [key: string]: KErrorInformation;
}

/**
 * A custom hook that fetches error information and provides a function to get the error information for a given error reason.
 * @returns A function getErrorInformation that takes the error reason as an argument and returns the error information for that particular error. This includes the error name, a list of Kubernetes events that can cause the error, a description of the error, and a list of references to Kubernetes documentation or other resources that can help resolve the error.
 */
const useErrorInformation = () => {
  const [errorInformation, setErrorInformation] =
    React.useState<KErrorInformationMap | null>(null);

  React.useEffect(() => {
    const fetchErrorInformation = async () => {
      const response = await fetch('/api/errors');
      const json = await response.json();
      setErrorInformation(json);
    };
    fetchErrorInformation();
  }, []);

  const getErrorInformation = React.useCallback(
    (reason: string) => {
      if (errorInformation) {
        return errorInformation[reason];
      }
      return null;
    },
    [errorInformation]
  );

  return { getErrorInformation };
};

export default useErrorInformation;
