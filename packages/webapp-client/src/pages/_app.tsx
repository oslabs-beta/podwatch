import PageLayout from '@/components/PageLayout/PageLayout';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import ThemeProvider from '../context/ThemeProvider/ThemeProvider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ClusterMain from '@/routes/ClusterMain';
import React from 'react';

const router = createBrowserRouter([
  {
    path: '/clustermain',
    element: <ClusterMain />,
  },
]);

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <ThemeProvider>
//       <PageLayout>
//         <Component {...pageProps} />
//       </PageLayout>
//     </ThemeProvider>
//   );
// }

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ThemeProvider>
    </React.StrictMode>
  );
}
