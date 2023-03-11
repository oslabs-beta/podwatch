import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import serverInstance from '../../utils/serverInstance';
import styles from './ClusterCreateForm.module.scss';

const ClusterCreateForm = () => {
  const [clusterName, setClusterName] = React.useState('');
  const [clusterDescription, setClusterDescription] = React.useState('');
  const [clusterId, setClusterId] = React.useState('');
  const [clusterSecret, setClusterSecret] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { data } = await serverInstance.post('/cluster', {
      name: clusterName,
      description: clusterDescription,
    });

    console.log(data);

    setClusterId(data.cluster.id);
    setClusterSecret(data.secret);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <CircularProgress />
      </div>
    );
  }

  if (clusterId && clusterSecret) {
    return (
      <div className={styles.container}>
        <h2>Cluster {clusterName} Created!</h2>
        <TextField
          className={styles.input}
          margin="normal"
          required
          fullWidth
          id="clusterId"
          label="Cluster ID"
          name="clusterId"
          color="secondary"
          autoComplete="clusterId"
          sx={{
            input: { color: 'white' },
            label: { color: '#FFFFFF80' },
          }}
          value={clusterId}
          onChange={(e) => e.preventDefault()}
          onFocus={(e) => {
            e.target.select();
          }}
        />
        <TextField
          className={styles.input}
          margin="normal"
          required
          fullWidth
          id="clusterSecret"
          label="Cluster Secret"
          name="clusterSecret"
          color="secondary"
          autoComplete="clusterSecret"
          sx={{
            input: { color: 'white' },
            label: { color: '#FFFFFF80' },
          }}
          value={clusterSecret}
          onChange={(e) => e.preventDefault()}
          onFocus={(e) => {
            e.target.select();
            setShowSecret(true);
          }}
          onBlur={() => setShowSecret(false)}
          type={showSecret ? 'text' : 'password'}
          helperText="You will only be able to see this once. Please save it somewhere safe."
          FormHelperTextProps={{ style: { color: 'white' } }}
        />
        <Link href={`/dashboard/${clusterId}`}>
          <Button variant="contained" color="secondary">
            Continue to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Box
        component="form"
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          className={styles.input}
          margin="normal"
          required
          fullWidth
          id="clusterName"
          label="Cluster Name"
          name="clusterName"
          color="secondary"
          autoComplete="clusterName"
          sx={{
            input: { color: 'white' },
            label: { color: '#FFFFFF80' },
          }}
          value={clusterName}
          onChange={(e) => setClusterName(e.target.value)}
          autoFocus
        />
        <TextField
          className={styles.input}
          margin="normal"
          required
          fullWidth
          id="clusterDescription"
          label="Cluster Description (Optional)"
          name="clusterDescription"
          color="secondary"
          autoComplete="clusterDescription"
          sx={{ input: { color: 'white' }, label: { color: '#FFFFFF80' } }}
          value={clusterDescription}
          onChange={(e) => setClusterDescription(e.target.value)}
          autoFocus
        />
        <Button
          className={styles.button}
          color="secondary"
          type="submit"
          fullWidth
          variant="contained"
          disabled={!clusterName}
          sx={{ mt: 3, mb: 2 }}
        >
          Create Cluster
        </Button>
      </Box>
    </div>
  );
};

export default ClusterCreateForm;
