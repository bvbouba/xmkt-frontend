import Sidebar from "@/components/Navbar";
import { dir } from 'i18next'

import "../globals.css";
import "@repo/ui/styles.css";
import { Inter } from "next/font/google";
import { languages } from '../i18n/settings'

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode;
  params: { lng: string }
}): JSX.Element {
  return (<>
    <html lang={lng} dir={dir(lng)}>
      <body className={`${inter.className} bg-gray-100`}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar lng={lng} />

          {/* Main Content */}
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
    </> );
}