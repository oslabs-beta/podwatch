import { useRouter } from 'next/router';
import React from 'react';
import useAuthenticate from '../hooks/useAuthenticate';
import serverInstance from '../utils/serverInstance';

const redirect = '/cluster';

const Auth = () => {
  const router = useRouter();
  const { user, setUser } = useAuthenticate();

  React.useEffect(() => {
    if (user) {
      router.push(redirect);
      return;
    }
    const getUser = async () => {
      const { data, status } = await serverInstance.get('/auth/user');
      if (status === 200) {
        setUser(data);
        router.push(redirect);
      }
      router.push('/signin');
    };
    getUser();
  }, []);

  return null;
};

export default Auth;
