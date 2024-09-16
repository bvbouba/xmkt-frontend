import "@/styles/globals.css";
import StoreProvider from '@/lib/providers/StoreProvider';
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { appWithTranslation } from 'next-i18next'
import { isAuthenticated } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};


function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);
  return (
    <SessionProvider session={session}>
      <StoreProvider>
          {getLayout(<Component {...pageProps} />)}
      </StoreProvider>
    </SessionProvider>
  );
}



export default appWithTranslation(App)
