import React from 'react';
import { UserContext } from '../context/UserProvider/UserProvider';

const useAuthenticate = () => {
  const { user, setUser } = React.useContext(UserContext);

  return { user, setUser };
};

export default useAuthenticate;
