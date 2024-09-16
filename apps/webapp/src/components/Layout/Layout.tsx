import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; 
import { NavBar } from "../NavBar";
import { SideBar } from "../Sidebar";
import usePaths from "@/lib/paths";

export function Layout({ children }: { children?: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const paths = usePaths()
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push(paths.auth.login.$url()); 
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />

        <main className="flex-1 overflow-x-hidden text-gray-500 overflow-y-auto p-8 bg-gray-200">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
