import { getServerSession } from "next-auth";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function SignupPage({ params: { lng } }:{params: { lng: string };}){
  const session = await getServerSession()
  if(session){
    redirect(`/${lng}/`)
  }
  return <Form lng={lng}/>
}