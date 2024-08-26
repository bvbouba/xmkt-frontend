import Sidebar from "@/components/Navbar";

import "./globals.css";
import "@repo/ui/styles.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}): JSX.Element {
  return (
    <html lang={params.locale}>
      <body className={`${inter.className} bg-gray-100`}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}