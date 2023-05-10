import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './SignInBox.module.scss';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import serverInstance from '@/utils/serverInstance';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="grey" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        PodWatch
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface SignInProps {}

const SignInBox: React.FC<React.PropsWithChildren<SignInProps>> = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await serverInstance.post('/auth/local/signin', 
        {email, password});
      router.push('/cluster')
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.innerBox}>
        <h1>Welcome back</h1>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            className={styles.input}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            color="secondary"
            autoComplete="email"
            sx={{ input: { color: 'white' } }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            className={styles.input}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            color="secondary"
            sx={{ input: { color: 'white' } }}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Grid container className={styles.links}>
            <Grid item xs>
              <Link href="#" variant="body2" color="secondary">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/auth/signup" variant="body2" color="secondary">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Grid className={styles.oauthIcons}>
            <IconButton>
              <GitHubIcon className={styles.oauthItem} />
            </IconButton>
            <IconButton href="http://localhost:3001/auth/google">
              <GoogleIcon className={styles.oauthItem} />
            </IconButton>
          </Grid>
          <Button
            className={styles.button}
            color="secondary"
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign In
          </Button>
        </form>
      </div>
      <Copyright sx={{ mt: 8, mb: 4 }} />
      </div>
  );
};

export default SignInBox;
