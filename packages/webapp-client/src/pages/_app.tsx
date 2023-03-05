import PageLayout from '@/components/PageLayout/PageLayout';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import ThemeProvider from '../context/ThemeProvider/ThemeProvider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../routes/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      {/* <PageLayout> */}
      <RouterProvider router={router} />
      {/* <Component {...pageProps} /> */}
      {/* </PageLayout> */}
    </ThemeProvider>
  );
}
