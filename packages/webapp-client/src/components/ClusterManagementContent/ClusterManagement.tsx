import React from 'react';
import styles from './CluterManagement.module.scss';
// import { Cluster } from '/Users/katherinecromer/Desktop/podwatch/packages/webapp-server/src/models/ClusterModel';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/joy/Button';
import { Cluster } from '/Users/katherinecromer/Desktop/podwatch/packages/webapp-server/src/models/ClusterModel';

interface ClusterProps {
  owner: string;
}

const ClusterManagement: React.FC<ClusterProps> = () => {
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
    { name: 'Codesmith Project', owner: 'Codesmith', id: '1234' },
    { name: 'Codesmith Project2', owner: 'Codesmith', id: '1235' },
  ];
  return (
    <>
      <div className="spacer" />
      <div className="ClusterManagement">
        <div>
          {clusters.map((cluster: any) => {
            return (
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ minHeight: '100vh' }}
              >
                <div key={cluster.id}>
                  <Grid>
                    <Card sx={{ m: 1 }} className={styles.card}>
                      <Typography
                        variant="body1"
                        fontSize="large"
                        //className={styles.name}
                      >
                        {cluster.name}
                      </Typography>
                      <Typography className={styles.date}>
                        Last Issued March 7 2023
                      </Typography>
                      <Button className={styles.status} />
                    </Card>
                  </Grid>
                </div>
              </Grid>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ClusterManagement;
