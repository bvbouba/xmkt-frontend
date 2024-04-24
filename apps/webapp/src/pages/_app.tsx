import "@/styles/globals.css";
import StoreProvider from '@/lib/providers/StoreProvider';
import type { AppProps } from "next/app";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { appWithTranslation } from 'next-i18next'
import { isAuthenticated } from "@/lib/auth";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};


function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);
  return (
    <StoreProvider>
      <AuthProvider isAuthenticated={typeof window !== "undefined" ? isAuthenticated(): false}>
  {getLayout(<Component {...pageProps} />)}
  </AuthProvider>
  </StoreProvider>
  );
}


export default appWithTranslation(App)
