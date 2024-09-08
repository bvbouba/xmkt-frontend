'use client'

import { useTranslation } from "@/app/i18n";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
    email: string;
    password: string;
  }

export default function Form({ lng  }: { lng: string }) {
  const { t } =  useTranslation(lng)
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();
  const [error,setError] = useState<string>()
  const [loading,setLoading] = useState<boolean>()

  const onSubmit = async (data: FormValues) => {
    const { password,email } = data;  
    setLoading(true)
    const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setLoading(false)
      if (result?.ok) {
        router.push(`/${lng}/`);
        router.refresh();
      } else {
        setError("Invalid credentials");
      }
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">{t("login")}</h2>
        <div className="mb-4">
          <label className="block mb-1">{t('email')}</label>
          <input
          {...register("email",{
            required: true,
          })}
            type="text"
            id="email"
            className="w-full p-2 border rounded"
            placeholder=""
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t('password')}</label>
          <input
          {...register("password",{
            required: true,
          })}
            type="password"
            id="password"
            className="w-full p-2 border rounded"
            placeholder=""
          />
        </div>
        <div>
      {error && (
                  <p className="text-sm text-red-500 pt-2">{error}</p>
                )}
      </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          {t("login")}
          {loading && "...."}
        </button>
      </form>
      
    </div>
  );
}