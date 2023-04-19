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
import useClusters from '../../hooks/useClusters';
import axios from 'axios';

const ClusterManagement: React.FC = () => {
  const { clusters } = useClusters();
  // useEffect(() => {
  //   axios
  //     .get('/notification/')
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  if (clusters) {
    axios
      .get('/notification')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
              owner={cluster.owner.email}
              clID={cluster.id}
            />
          );
        })}
      </div>
    </>
  );
};

export default ClusterManagement;
