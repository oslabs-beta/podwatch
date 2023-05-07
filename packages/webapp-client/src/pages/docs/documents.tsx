import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
//take the signinbox out in minutes
import ReactDom from 'react-dom';

import { MDXProvider } from '@mdx-js/react';
import DocumentScreen from '@/components/DocumentContent/DocumentScreen.mdx';
import documentMDX from '/pages/docs/documentMDX.mdx';
import Content from '!@mdx-js/loader!./documentMDX.mdx';
import type { MDXComponents } from 'mdx/types.js';

const myDocument: NextPage = () => {
  return <Content />;
};

export default myDocument;
