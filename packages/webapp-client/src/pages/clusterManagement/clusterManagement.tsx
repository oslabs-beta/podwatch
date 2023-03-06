import React from 'react';
//import the model for the cluster
import { Cluster } from '../../../../webapp-server/src/models/ClusterModel';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from './clusterManagement.module.css';

const ClusterSummary = () => {
  const [clusters, setClusters] = React.useState<Cluster[]>([]);
  React.useEffect(() => {
    const fetchClusters = async () => {
      const response = await fetch('/cluster');
      const clusters = await response.json();
      setClusters(clusters);
    };
    fetchClusters();
  }, []);

  const navigate = useNavigate();

  //   const createCluster = () => {
  //     navigate('/cluster/');
  //   };
  return (
    //
    <div className={styles.clusterSetup}>
      <Box>
        <div className={styles.allClusters}>
          <Typography> All Clusters</Typography>
        </div>
        <List>
          <div className={styles.createdDate}>
            <Typography> Created Date</Typography>
          </div>
          <div className={styles.status}>
            <Typography>Status</Typography>
          </div>
        </List>
      </Box>
      <Divider />
      <Box>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {clusters.map((cluster) => (
            <div key={cluster.id} className={styles.clusterName}>
              <ListItem key={cluster.id}>
                <ListItemText primary={cluster.name}></ListItemText>
              </ListItem>
              <IconButton> edit</IconButton>
            </div>
          ))}
        </List>
      </Box>
    </div>
  );
};
export default ClusterSummary;
