'use client'

import { useTranslation } from "@/app/i18n";
import usePaths from "@/lib/paths";
import { fetchSchools, getUserByEmail, signup } from "features/data";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { school } from "types";

type FormValues = {
    email: string;
    password1: string;
    password2: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string; 
    jobTitle?: string; 
    school?: string; 
  };
  

export default function Form({ lng  }: { lng: string }) {
  const { t } =  useTranslation(lng)
  const router = useRouter();
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors: errorsForm },
  } = useForm<FormValues>();
  const [error,setError] = useState<string>()
  const [loading,setLoading] = useState<boolean>()
  const [userType, setUserType] = useState<string>("1");
  const [errors,setErrors] = useState<string>("")
  const [schools,setSchools] = useState<school[]>()

  const watchPassword = watch("password1", "");
  const validatePasswordMatch = (value: string) => {
    return value === watchPassword || t("passwords_do_not_match.");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchSchools();
        setSchools(response)
      } catch (error) {
        console.error('Error getting course:', error);
      }
    }
    loadData()
  }, []);

  const onSubmit = async (data: FormValues) => {
    const {
      password1,
      email,
      password2,
      firstName,
      lastName,
      phoneNumber,
      school,
    } = data;

    setLoading(true)
      try {
        const response = await getUserByEmail(email)
        if (response.id) {
          setErrors(t("user_already_exists"));
          setLoading(false)
          return;
        }
      } catch (error) {
         console.error("user not found")
      }
      
      if (userType) {
        const response1 =  await signup({
          password1, password2, email, firstName, lastName,userType,phone:phoneNumber,school 
        })        
      if (response1.key) {
        router.push(`/${lng}/`);
      } else {
        setErrors(t('user_registration_failed'))
      }
      setLoading(false)
       }
   
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <form className="max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-4">{t("sign_up")}</h2>
            <div>
              <div className="mb-4">
              <label className="block mb-1">{t('email')}</label>
                <input
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("invalid_email_format"),
                    },
                  })}
                  id="email"
                  placeholder=""
                  type="text"
                  className="w-full p-2 border rounded"
                />
                {!!errorsForm.email && (
                  <p className="text-sm text-red-500 pt-2">
                    {errorsForm.email?.message}
                  </p>
                )}
              </div>

              <div className="mb-4 flex flex-col xl:flex-row gap-5">
                <div>
                <label className="block mb-1">{t('password')}</label>
                  <input
                    {...register("password1", {
                      required: true,
                      minLength: {
                        value: 7,
                        message: t("password_must_be_at_least_7_characters"),
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/,
                        message: t("password_must_include_at_least_one_letter,_one_digit,_and_one_special_character"),
                      },
                    })}
                    spellCheck={false}
                    id="password1"
                    placeholder=""
                    type="password"
                    className="w-full p-2 border rounded"
                  />
                  {!!errorsForm.password1 && (
                    <p className="text-sm text-red-500 pt-2">
                      {errorsForm.password1?.message}
                    </p>
                  )}
                </div>
                <div>
                <label className="block mb-1">{t("confirm_password")}</label>
                  <input
                    {...register("password2", {
                      required: true,
                      validate: validatePasswordMatch,
                    })}
                    spellCheck={false}
                    id="password2"
                    type="password"
                    placeholder=""
                    className="w-full p-2 border rounded"
                  />
                  {!!errorsForm.password2 && (
                    <p className="text-sm text-red-500 pt-2">
                      {errorsForm.password2?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4 flex flex-col xl:flex-row gap-5">
                <div>
                <label className="block mb-1">{t("firstname")}</label>
                  <input
                    {...register("firstName", {
                      required: true,
                    })}
                    id="firstname"
                    placeholder=""
                    type="text"
                    className="w-full p-2 border rounded"
                  />
                  {!!errorsForm.firstName && (
                    <p className="text-sm text-red-500 pt-2">
                      {errorsForm.firstName?.message}
                    </p>
                  )}
                </div>
                <div>
                <label className="block mb-1">{t("lastname")}</label>
                  <input
                    {...register("lastName", {
                      required: true,
                    })}
                    id="lastname"
                    placeholder=""
                    type="text"
                    className="w-full p-2 border rounded"
                  />
                  {!!errorsForm.lastName && (
                    <p className="text-sm text-red-500 pt-2">
                      {errorsForm.lastName?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional fields for instructors */}
              {userType === "1" && (
                <>
                  <div className="mb-4">
                  <label className="block mb-1">{t("phone_number")}</label>
                    <input
                      {...register("phoneNumber", {
                        required: true,
                        pattern: {
                          value: /^\d{10}$/,
                          message: t("phone_number_must_be_10_digits"),
                        },
                      })}
                      id="phoneNumber"
                      placeholder=""
                      type="text"
                      className="w-full p-2 border rounded"
                    />
                    {!!errorsForm.phoneNumber && (
                      <p className="text-sm text-red-500 pt-2">
                        {errorsForm.phoneNumber?.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                  <label className="block mb-1">{t('school')}</label>
                    <select
                      {...register("school", {
                        required: true,
                      })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">{t("select_school")}</option>
                      {schools?.map((school) => (
                        <option value={school.id} key={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                    {!!errorsForm.school && (
                      <p className="text-sm text-red-500 pt-2">
                        {errorsForm.school?.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="mb-4">
              <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
                {t("sign_up")}
                {loading && "...."}
                </button>
              </div>
             {errors && <div className="text-red-500" >{errors}</div>}
            </div>
          </form>
      
    </div>
  );
}