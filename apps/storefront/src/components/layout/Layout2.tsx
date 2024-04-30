import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../footer";
import { NavbarSimple } from "../navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
      <div className="flex flex-col">
      <NavbarSimple />
        {children}
        <Footer />
        </div>
  );
}

export default RootLayout;