import * as React from 'react';

import { KErrorInformation } from '../../hooks/useErrorInformation';
import { KError } from '../../types/KError';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import styles from './ErrorItem.module.scss';

interface ErrorItemProps {
  error: KError;
  info: KErrorInformation | null;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error, info }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [nativeExpanded, setNativeExpanded] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent) => {
    if (expanded) {
      setNativeExpanded(false);
    }
    setExpanded((expanded) => !expanded);
  };

  const handleNativeChange = (event: React.SyntheticEvent) => {
    setNativeExpanded((nativeExpanded) => !nativeExpanded);
  };

  return (
    <li className={styles.container}>
      <div className={styles.preview} onClick={handleChange}>
        <div className="icon">
          <ExpandCircleDownIcon
            sx={{
              transform: `rotate(${expanded ? '0' : '-90'}deg)`,
              transition: `transform 0.2s ease-in-out`,
              fill: 'white',
            }}
          />
        </div>
        <div className={styles.header}>
          <h2>{error.reason}</h2>
          <time>{error.firstTimestamp.toLocaleTimeString()}</time>
        </div>
      </div>
      {expanded && (
        <div className={styles.details}>
          <div className={styles.main}>
            <h4>{error.type}</h4>
            <p>{error.message}</p>
            <p>Name: {error.name}</p>
            <p>Count: {error.count}</p>
            <p>First Timestamp: {error.firstTimestamp.toISOString()}</p>
            <p>Last Timestamp: {error.lastTimestamp.toISOString()}</p>
          </div>

          {info && (
            <div className={styles.info}>
              <h3>{info.name}</h3>
              <p>{info?.description}</p>
              <p>Potential causes include {info.events.join(', ')}</p>
              <h4>Read More</h4>
              {info.references.map((reference) => {
                return (
                  <div className={styles.link}>
                    <LaunchIcon fontSize="small" />
                    <a
                      href={reference}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {reference}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles.native}>
            <div className={styles.nativeToggle} onClick={handleNativeChange}>
              <ExpandMoreIcon
                fontSize="small"
                sx={{
                  transform: `rotate(${nativeExpanded ? '0' : '-90'}deg)`,
                  transition: `transform 0.2s ease-in-out`,
                }}
              />
              <h3>Native Event</h3>
            </div>
            {nativeExpanded && (
              <pre className={styles.pre}>
                {JSON.stringify(error.nativeEvent, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

export default ErrorItem;
