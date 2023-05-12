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
      <Footer
        links={[
          { name: 'Home', href: '/' },
          { name: 'Documentation', href: '/docs' },
          {
            name: 'Repository',
            href: 'https://github.com/oslabs-beta/podwatch',
          },
        ]}
      />
    </>
  );
};

export default PageLayout;
