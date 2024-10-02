import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'
  return (
    <Html lang="fr">
      <Head>
        <link rel="icon" href={`${basePath}/ico.svg`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
