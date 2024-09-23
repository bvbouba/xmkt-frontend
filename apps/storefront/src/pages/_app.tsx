import "@/css/input.css";
import { NextPage } from 'next';
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect, useState } from 'react';
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
    const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  return <SessionProvider session={session}>
  {isClient ? getLayout(<Component {...pageProps} />) : <div></div>}
  </SessionProvider>
} 

export default appWithTranslation(App)
 