import "@/styles/globals.css";
import "@/styles/buttonStyles.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { appWithTranslation } from 'next-i18next'
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
    <SessionProvider session={session} basePath={`/api/auth`}>
          {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}



export default appWithTranslation(App)
