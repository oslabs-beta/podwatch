import React from 'react';
import serverInstance from '../utils/serverInstance';

const SignInPage = () => {
  return (
    <div>
      <a href="http://localhost:3001/auth/google">
        <button>Google</button>
      </a>
    </div>
  );
};

export default SignInPage;
