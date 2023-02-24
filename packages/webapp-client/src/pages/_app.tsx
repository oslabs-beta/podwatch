import PageLayout from '@/components/PageLayout/PageLayout';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import ThemeProvider from '../context/ThemeProvider/ThemeProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ThemeProvider>
  );
}
