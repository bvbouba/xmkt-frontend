import {  useSession } from "next-auth/react";
import { useRouter } from "next/router"; 
import { NavBar } from "../NavBar";
import { SideBar } from "../Sidebar";
import usePaths from "@/lib/paths";
import { useEffect } from "react";
import { Loading } from "../Loading";

export function Layout({ children }: { children?: React.ReactNode }) {
  const { status,data:session } = useSession();
  const router = useRouter();
  const paths = usePaths()
  const user = session?.user

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(paths.auth.login.$url());
    }
  
    if (session?.accessToken && (!user || Object.keys(user).length === 0)) {
      router.push(paths.auth.login.$url());
    }
  }, [status, session, user, router, paths.auth.login]);

  return (

    <>
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />

        <main className="flex-1 overflow-x-hidden text-gray-500 overflow-y-auto p-8 bg-gray-200">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}

export default Layout;
