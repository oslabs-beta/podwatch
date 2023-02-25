import React from 'react';
import Header from '../Header/Header';

interface PageLayoutProps {}

const PageLayout: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default PageLayout;
