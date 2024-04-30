import "@/css/input.css";
import { NextPage } from 'next';
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react';
import { appWithTranslation } from 'next-i18next'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
  
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
  };

function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return getLayout(<Component {...pageProps} />)
}

export default appWithTranslation(App)
