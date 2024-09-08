'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ContactPage({ params: { lng } }:{params: { lng: string };}) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return redirect(`/${lng}/login`)
  }
  return (
    <div>
      <h1>Contact Us</h1>
      <p>This is the contact page.</p>
    </div>
  );
}
