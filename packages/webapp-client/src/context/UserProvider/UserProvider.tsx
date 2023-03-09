import React from 'react';
import { User } from '../../types/User';

interface UserContext {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = React.createContext<UserContext>({
  user: null,
  setUser: () => {},
});

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
