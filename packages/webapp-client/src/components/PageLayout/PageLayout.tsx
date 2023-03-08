import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

interface PageLayoutProps {}

const PageLayout: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PageLayout;
