'use client'

import { useTranslation } from "@/app/i18n";
import { createCourse, fetchCountries, fetchSchools, getCourse, editCourse } from "@/lib/data";
import { country, school, CourseDetails } from "@/lib/data/type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  simulation: number,
  courseName: string,
  description: string,
  school: number,
  country: number,
  startDate: string,
  endDate: string,
  participantCount: number,
  purchaser: number,
}

export default function Form({ lng, id }: { lng: string, id?: number }) {
  const { t } = useTranslation(lng);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormValues>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const { data: session,status } = useSession();
  const [countries, setCountries] = useState<country[]>([]);
  const [schools, setSchools] = useState<school[]>([]);
  const selectedCountry = watch("country");
  const [today,setToday] = useState(new Date().toISOString().split('T')[0])
  // Fetch countries from the API
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await fetchCountries();
        setCountries(response);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetch();
  }, []);

  // Fetch schools based on selected country
  useEffect(() => {
    if (selectedCountry) {
      const fetch = async () => {
        try {
          const response = await fetchSchools();
          setSchools(response.filter(s => s.country_id == selectedCountry));
        } catch (error) {
          console.error('Error fetching universities:', error);
        }
      };
      fetch();
    }
  }, [selectedCountry]);

  // Fetch course data if editing
  useEffect(() => {
    if (id && status === "authenticated") {
      const fetch = async () => {
        try {
          const courseData: CourseDetails = await getCourse({courseId:id,token:session.accessToken});
          if (courseData) {
            setValue("simulation", courseData.simulation);
            setValue("courseName", courseData.course_name);
            setValue("description", courseData.course_description);
            setValue("school", courseData.school);
            setValue("country", courseData.country);
            setValue("startDate", courseData.start_date.split('T')[0]);
            setValue("endDate", courseData.end_date.split('T')[0]);
            setValue("participantCount", courseData.participant_count);
            setValue("purchaser", courseData.purchaser);
            setToday(courseData.start_date.split('T')[0])
          }else {
            setError(t("course_not_found"));
          } 
        } catch (error) {
          console.error('Error fetching course:', error);
          setError(t("course_not_found"));
        }
      };
      fetch();
    }
  }, [id, setValue,session?.accessToken]);

  const onSubmit = async (data: FormValues) => {
    const { simulation, courseName, description, school, country, startDate, endDate, participantCount, purchaser } = data;

    const token = session?.accessToken;
    if (token) {
      setLoading(true);
      try {
        if (id) {
          await editCourse({courseId:id, 
            course:{
              courseName, description,
              startDate: new Date(startDate).toISOString(),
              endDate: new Date(endDate).toISOString(),
              participantCount
            }
            , token});
        } else {
          await createCourse(
            {
              simulation, courseName, description, school, country,
              startDate: new Date(startDate).toISOString(),
              endDate: new Date(endDate).toISOString(),
              participantCount, purchaser
            }
            , token);
        }
        router.push(`/${lng}/course`);
        router.refresh();
      } catch (error) {
        console.error('Error submitting course:', error);
        setError(id ? t("course_update_failed") : t("course_creation_failed"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-1/2">
        <h1 className="text-2xl font-semibold mb-6">{id ? t("edit_course") : t("add_new_course")}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6 space-y-4">

          {/* Simulation Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("simulation")}</label>
            <select
              {...register("simulation", {
                required: true,
              })}
              id="simulation"
              disabled={!!id}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="1">Simulation v1.0</option>
            </select>
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("course_name")}</label>
            <input
              {...register("courseName", {
                required: true,
              })}
              type="text"
              id="courseName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* Course Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("course_description")}</label>
            <textarea
              {...register("description", {
                required: true,
              })}
              id="description"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("country")}</label>
            <select
              {...register("country", {
                required: !id,
              })}
              disabled={!!id}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="">{t("select_a_country")}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>

          {/* University Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("college_university")}</label>
            <select
              {...register("school", {
                required: !id,
              })}
              disabled={!!id}
              id="school"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="">{t("select_a_university")}</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>

          {/* Program Dates */}
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("program_from")}</label>
              <input
                {...register("startDate", {
                  required: true,
                  validate: {
                    notPast: value => new Date(value) >= new Date(today) || t("start_date_cannot_be_in_the_past")
                  }
                })}
                type="date"
                id="startDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
              {errors.startDate && <span className="text-red-600 text-sm">{errors.startDate.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("program_to")}</label>
              <input
                {...register("endDate", {
                  required: true,
                  validate: {
                    afterStartDate: value => new Date(value) > new Date(watch("startDate")) || t("end_date_must_be_after_start_date")
                  }
                })}
                id="endDate"
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
              {errors.endDate && <span className="text-red-600 text-sm">{errors.endDate.message}</span>}
            </div>
          </div>

          {/* Number of Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("number_of_participants")}</label>
            <input
              {...register("participantCount", {
                required: true,
                min: {
                  value: 10,
                  message: t("number_of_participants_must_be_at_least_10")
                }
              })}
              id="participantCount"
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
            {errors.participantCount && <span className="text-red-600 text-sm">{errors.participantCount.message}</span>}
          </div>

          {/* Purchaser Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("purchaser")}</label>
            <select
              {...register("purchaser", {
                required: true,
              })}
              disabled={!!id}
              id="purchaser"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="1">{t("individual_participant")}</option>
              <option value="2">{t("university")}</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            {id ? t("update_course") : t("create_course")}
              {loading && "...."}
            </button>
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
