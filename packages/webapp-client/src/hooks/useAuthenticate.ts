import { useRouter } from 'next/router';
import React from 'react';
import { UserContext } from '../context/UserProvider/UserProvider';
import serverInstance from '../utils/serverInstance';

/**
 * A hook that returns the current logged in user. If the user is not logged in, this hook will redirect the user to the provided page.
 * @param redirect The page to redirect the user to if they are not logged in. If left undefined, the user will not be redirected.
 * @returns
 */
const useAuthenticate = (redirect?: string) => {
  const { user, setUser } = React.useContext(UserContext);

  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      return;
    }
    const getUser = async () => {
      const { data, status } = await serverInstance.get('/auth/user');
      if (status === 200) {
        setUser(data);
        return;
      }
      if (redirect) {
        router.push('/signin');
      }
    };
    getUser();
  }, [user]);

  return { user, setUser };
};

export default useAuthenticate;
