import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import SignUpBox from '@/components/SignUpBox/SignUpBox';

interface SignUpPageProps {
    
  }

const SignUpScreen: NextPage<SignUpPageProps> = () => {
    return (
        <SignUpBox/>
    );
  };

export default SignUpScreen;