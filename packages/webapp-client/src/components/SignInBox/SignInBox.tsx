import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import styles from './SignInBox.module.scss';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';

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


interface SignInProps {};

const SignInBox: React.FC<React.PropsWithChildren<SignInProps>> = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = JSON.stringify({
      email,
      password,
    });
    const response = await fetch('/auth/local/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (response.status === 200) {

      router.push('/');
    }
  };

  return (
      <Container className={styles.main}>
        <Box className={styles.innerBox}>
          <Box component="form" className ={styles.form} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              className={styles.input}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              color='secondary'
              autoComplete="email"
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
              color='secondary'
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
            className={styles.button}
            color='secondary'
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" color='secondary'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/signup" variant="body2" color='secondary'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Grid className={styles.oauthIcons}>
                <IconButton ><GitHubIcon className={styles.oauthItem}/></IconButton>
                <IconButton href="http://localhost:3001/auth/google"><GoogleIcon className={styles.oauthItem}/></IconButton>
            </Grid>
            
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
};

export default SignInBox;