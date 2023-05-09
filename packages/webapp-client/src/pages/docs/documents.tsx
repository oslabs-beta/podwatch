import { NextPage } from 'next';
//take the signinbox out in minutes

import Content from '!@mdx-js/loader!./documentMDX.mdx';

const myDocument: NextPage = () => {
  function selectElementContents() {
    console.log('yay');
  }
  return <Content />;
};

export default myDocument;
