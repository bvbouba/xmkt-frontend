'use client'

import { useTranslation } from "@/app/i18n";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage({ params: { lng } }:{params: { lng: string };}) {
  const { t } =  useTranslation(lng)
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      redirect: false,
      email:formData.get("email"),
      password:formData.get("password"),
    });
    console.log({result})
    if (result?.ok) {
      router.push(`/${lng}/`);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">{t("login")}</h2>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          {t("login")}
        </button>
      </form>
    </div>
  );
}