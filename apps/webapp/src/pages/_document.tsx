import { Html, Head, Main, NextScript } from "next/document";
import { useRouter } from "next/router";

export default function Document() {
  const locale = 'fr'
  const isFrench = locale === 'fr';

  return (
    <Html lang={locale}>
      <Head>
        <link rel="icon" href={`/ico.svg`} />
        {isFrench ? (
          <>

            <meta name="description" content="Logiciel de simulation marketing conçu pour permettre aux étudiants et professionnels de pratiquer la prise de décision et de tester des théories dans un environnement compétitif." />
            <title>Jeu de Simulation Marketing & Stratégie</title>

            <meta property="og:title" content="Jeu de Simulation Marketing & Stratégie" />
            <meta property="og:description" content="Participez à des simulations marketing et stratégie réalistes pour aider les étudiants et professionnels à améliorer leurs compétences et à prendre des décisions dans un marché dynamique." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://simuprof.ddns.com/marketing/" />

          
          </>
        ) : (
          <>
            <meta name="description" content="Marketing & Strategy simulation software designed for students and professionals to practice decision-making and test theories in a competitive environment." />
            <title>Marketing & Strategy Simulation Game</title>

            <meta property="og:title" content="Marketing & Strategy Simulation Game" />
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
