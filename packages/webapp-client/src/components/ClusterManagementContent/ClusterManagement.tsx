import React from 'react';
import styles from './CluterManagement.module.scss';
//import Cluster from '../../../../webapp-server/src/models/ClusterModel';
import Card from '@mui/material/Card';
import { CardHeader } from '@mui/material';
import CardActions from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { Cluster } from '/Users/katherinecromer/Desktop/podwatch/packages/webapp-server/src/models/ClusterModel';
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
      <div className="spacer" />
      <div className="ClusterManagement">
        <div className={styles.extraBlue}>
          <div className={styles.header}>
            <Typography
              sx={{
                color: '#eeeeee',
                textAlign: 'center',
                fontSize: 18,
                fontFamily: 'Mulish',
              }}
            >
              All Clusters
            </Typography>
            <div className={styles.backgroundBlack}>
              <div>
                {clusters.map((cluster: any) => {
                  return (
                    <div key={cluster.id}>
                      <Card
                        sx={{ minWidth: 275, m: 2 }}
                        className={styles.card}
                      >
                        <CardContent>
                          <Typography sx={{ fontSize: 22 }}>
                            {cluster.name}
                            <Button
                              size="small"
                              className={styles.active}
                              sx={{ color: '#eeeeee' }}
                            >
                              ONLINE
                            </Button>
                          </Typography>

                          <Typography
                            sx={{ mb: 1.5, fontSize: 12 }}
                            className={styles.date}
                          >
                            March 9, 2023
                          </Typography>
                          <Typography variant="body2">
                            LAST ISSUE 0 DAYS AGO
                          </Typography>
                        </CardContent>
                      </Card>
                      {/* <Card sx={{ m: 1 }} className={styles.card}>
                        <CardContent>
                          <Typography variant="body1" className={styles.name}>
                            {cluster.name}
                          </Typography>

                          <Typography className={styles.date}>
                            March 9, 2023
                          </Typography>

                          <Typography className={styles.issueDate}>
                            LAST ISSUE 0 DAYS AGO
                          </Typography>

                          <Typography className={styles.active}>
                            ONLINE
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small">Learn More</Button>
                        </CardActions>
                      </Card> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClusterManagement;
