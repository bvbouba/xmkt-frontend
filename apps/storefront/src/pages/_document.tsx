import { Html, Head, Main, NextScript } from "next/document";
import { useRouter } from "next/router";

export default function Document() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/store'
  const { locale } = useRouter();
  const isFrench = locale === 'fr';
  
  return (
    <Html lang={locale}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href={`${basePath}/ico.svg`} />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        />
         {/* Conditional Meta Tags */}
         {isFrench ? (
          <>
            <meta name="description" content="Jeu de simulation pour l'enseignement supérieur" />
            <title>Jeux de simulation pour l'enseignement</title>
            <meta property="og:title" content="Jeux de simulation engageants pour l'apprentissage dans l'enseignement supérieur" />
            <meta property="og:description" content="Permettez à vos étudiants de pratiquer et d'apprendre grâce à des jeux de simulation interactifs conçus pour l'enseignement supérieur. Améliorez l'engagement et la compréhension avec nos solutions innovantes." />
          </>
        ) : (
          <>
            <meta name="description" content="Simulation Game for Higher Education" />
            <title>Engaging Simulation Games for Learning in Education</title>
            <meta property="og:title" content="Engaging Simulation Games for Learning in Higher Education" />
            <meta property="og:description" content="Empower your students to practice and learn through interactive simulation games designed for higher education. Enhance engagement and understanding with our innovative solutions." />
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
