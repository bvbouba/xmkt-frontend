import { Html, Head, Main, NextScript } from "next/document";
import { useRouter } from "next/router";

export default function Document() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'
  const locale = 'fr'
  const isFrench = locale === 'fr';

  return (
    <Html lang={locale}>
      <Head>
        <link rel="icon" href={`${basePath}/ico.svg`} />
        {isFrench ? (
          <>

            <meta name="description" content="Logiciel de simulation marketing conçu pour permettre aux étudiants et professionnels de pratiquer la prise de décision et de tester des théories dans un environnement compétitif." />
            <title>Jeu de Simulation Marketing</title>

            <meta property="og:title" content="Jeu de Simulation Marketing" />
            <meta property="og:description" content="Participez à des simulations marketing réalistes pour aider les étudiants et professionnels à améliorer leurs compétences et à prendre des décisions dans un marché dynamique." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://simuprof.ddns.com/marketing/" />

          
          </>
        ) : (
          <>
            <meta name="description" content="Marketing simulation software designed for students and professionals to practice decision-making and test theories in a competitive environment." />
            <title>Marketing Simulation Game</title>

            <meta property="og:title" content="Marketing Simulation Game" />
            <meta property="og:description" content="Engage in realistic marketing simulations that help students and professionals hone their skills and improve decision-making in a dynamic marketplace." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://simuprof.ddns.com/marketing/" />
          
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
