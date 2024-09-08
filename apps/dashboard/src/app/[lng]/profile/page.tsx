'use client'

import { useTranslation } from "@/app/i18n";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfilePage({ params: { lng } }:{params: { lng: string };}) {
  const { data: session, status } = useSession()
  const { t } =  useTranslation(lng)

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return redirect(`/${lng}/login`)
  }
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">{t("profile")}</h1>
      <div className="space-y-4">
        <div className="">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("firstName")}
          </label>
          <p className="text-gray-900">{session?.user.firstname}</p>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("lastName")}
          </label>
          <p className="text-gray-900">{session?.user.lastname}</p>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("email")}
          </label>
          <p className="text-gray-900">{session?.user.email}</p>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("school")}
          </label>
          <p className="text-gray-900">{session?.user.school}</p>
        </div>
      </div>
    </div>
  );
}
