import React from 'react';
import styles from './CluterManagement.module.scss';
//import Cluster from '../../../../webapp-server/src/models/ClusterModel';
import Card from '@mui/material/Card';
import { CardHeader } from '@mui/material';
import CardActions from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ClusterCard from '../ClusterCard/ClusterCard';

// import { Cluster } from '/Users/katherinecromer/Desktop/podwatch/packages/webapp-server/src/models/ClusterModel';

// interface ClusterProps {
//   owner: string;
// }

const ClusterManagement: React.FC = () => {
  //const [clusters, setClusters] = React.useState<Cluster[]>;
  //   React.useEffect(() => {
  //     const fetchClusters = async () => {
  //       const getClusters = await fetch('/clusters', {
  //         method: 'GET',
  //         headers: {
  //           owner,
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       const userClusters = await getClusters.json();
  //       setClusters(userClusters);
  //     };
  //   }, []);
  const clusters = [
    { name: 'Project 1', owner: 'Codesmith', id: '1234' },
    { name: 'Project2', owner: 'Codesmith', id: '1235' },
    { name: 'Project3', owner: 'Codesmith', id: '1235' },
  ];
  return (
    <>
      <div className={styles.spacer}>
        <div>
          <p>All Clusters</p>
        </div>
      </div>
      <div className={styles.ClusterManagement}>
        {clusters.map((cluster) => {
          return (
              <ClusterCard
                name={cluster.name}
                owner={cluster.owner}
                clID={cluster.id}
              />
          );
        })}
      </div>
    </>
  );
};

export default ClusterManagement;
