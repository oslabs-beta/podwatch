import '@/styles/globals.scss';
import { createTheme, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import PageLayout from '@/components/PageLayout/PageLayout';
import variables from '@/styles/exports.module.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: variables.colorPrimary,
    },
    secondary: {
      main: variables.colorSecondary,
    },
  },
  typography: {
    fontFamily: variables.fontMain,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ThemeProvider>
  );
}
