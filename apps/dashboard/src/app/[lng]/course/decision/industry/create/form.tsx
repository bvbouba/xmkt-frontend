'use client'

import { useTranslation } from "@/app/i18n";
import { createIndustry } from "@/lib/data";
import {  useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
    name: string;
    numberOfTeams: number;
  }

export default function Form({ lng }: { lng: string }) {
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
  const { data: session,status } = useSession();
  
  const onSubmit = async (data: FormValues) => {
    const { name,numberOfTeams } = data;  
    if (status === "authenticated") {
    setLoading(true)
    try {
    await createIndustry({
        name,
        number_of_teams:numberOfTeams,
        course:session.courseId
    },session.accessToken)
    setLoading(false)
    router.push(`/${lng}/course/decision/industry`);
    router.refresh();
    }catch (error:any) {
      const code = error.response.data.code
      if (code === 1001) {
        setError(t("This_name_is_already_used_under_this_course"))
      }else{
        console.error('Error submitting industry:', error);
        setError(t("industry_creation_failed"));
      }
      }
      setLoading(false)
    }
  };


  return (
   
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">{t("create_industry")}</h1>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-1/2">
      {/* Industry Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t("industry_name")}
        </label>
        <input
          id="name"
          type="text"
          {...register('name', {
            required: t("industry_name_is_required"),
            minLength: {
              value: 4,
              message: t("industry_name_must_be_at_least_four_characters"),
            },
            maxLength: {
              value: 10,
              message: t("industry_name_cannot_exceed_ten_characters"),
            },
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Number of Teams Field */}
      <div>
        <label htmlFor="numberOfTeams" className="block text-sm font-medium text-gray-700">
          {t("number_of_teams")}
        </label>
        <select
          id="numberOfTeams"
          {...register('numberOfTeams', { required: t("number_of_teams_is_required") })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        {errors.numberOfTeams && <p className="text-red-500 text-sm mt-1">{errors.numberOfTeams.message}</p>}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className=" inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t("create_industry")} {loading && "...."}
        </button>
        <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 ml-4 rounded-md shadow-lg"
              onClick={() => router.back()}
            >
              {t("go_back")}
            </button>
      </div>
    </form>
    <div className="mt-5">
      {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
  </div>
  );
}