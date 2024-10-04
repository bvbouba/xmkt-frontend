'use client';

import Sidebar from "@/components/Navbar";
import { dir } from 'i18next';
import "../globals.css";
import "@repo/ui/styles.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  params: { lng }
}: {
  children: React.ReactNode;
  params: { lng: string }
}): JSX.Element {
  const pathname = usePathname();
  const showSidebar = !(pathname.includes("/dashboard/data") || 
                        pathname.includes("/login") ||
                        pathname.includes("/signup") ||
                        pathname.includes("/dashboard/team"));
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/admin'
  return (
    <SessionProvider basePath={`${basePath}/api/auth`}>
      <html lang={lng} dir={dir(lng)}>
        <head>
        <link rel="icon" href={`${basePath}/ico.svg`} />
        </head>
        <body className={`${inter.className} bg-gray-100`}>
          <div className="flex h-screen">
            {showSidebar && <Sidebar lng={lng} />}
            <main className="flex-1 p-4 overflow-auto">
              {children}
            </main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
