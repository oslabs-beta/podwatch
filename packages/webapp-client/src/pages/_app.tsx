import PageLayout from '@/components/PageLayout/PageLayout';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import ThemeProvider from '../context/ThemeProvider/ThemeProvider';
import UserProvider from '../context/UserProvider/UserProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ThemeProvider>
    </UserProvider>
  );
}
