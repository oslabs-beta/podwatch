import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import styles from './SignUpBox.module.scss';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import serverInstance from '@/utils/serverInstance';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        PodWatch
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface SignUpProps {};

const SignUpBox: React.FC<React.PropsWithChildren<SignUpProps>> = () => {

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const body = JSON.stringify({
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    // });
    // console.log(body);
  //   const response = await fetch('/auth/register', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body,
  //   });

  //   if (response.status === 200) {
  //     router.push('/');
  // };
  try {
    await serverInstance.post('/auth/local/signup', {
    
      firstName,
      lastName,
      email,
      password,
    
  });
  router.push('/cluster')
}
catch(err){
  console.log(err);
}
};

  return (
    <div className={styles.main}>
      <div className={styles.innerBox}>
        <h1>Welcome</h1>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                className={styles.input}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  color="secondary"
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                className={styles.input}
                  required
                  fullWidth
                  color="secondary"
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                className={styles.input}
                  required
                  fullWidth
                  color="secondary"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                className={styles.input}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  color="secondary"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="center" className={styles.links}>
              <Grid item>
                <Link href="/auth/signin" variant="body2" color='secondary'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Grid className={styles.oauthIcons}>
                <IconButton><GitHubIcon className={styles.oauthItem}/></IconButton>
                <IconButton><GoogleIcon className={styles.oauthItem}/></IconButton>
            </Grid>
            <Button
            className={styles.button}
              type="submit"
              color='secondary'
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </form>
        </div>
        <Copyright sx={{ mt: 5 }} />
      </div>
  );
};

export default SignUpBox;