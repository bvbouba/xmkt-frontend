import formatDate from "@/lib/date";
import usePaths from "@/lib/paths";
import { fetchCoursesById, getParticipant, registerForCourse } from "features/data";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CourseProps } from "types";

type FormValues = {
  courseid: string;
};


export function SectionCourseDetail() {

  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setError: setErrorForm,
  } = useForm<FormValues>();
  const { data: session, status } = useSession();
  const [course,setCourse] = useState<CourseProps>()
  const [success,setSuccess] = useState(false)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/store'
  const [error, setError] = useState<string>();

  const onSubmit = async (data: FormValues) => {
    const {
      courseid
    } = data;

      setLoading(true)
        try {
           const courseData = await fetchCoursesById({ courseid })
           setCourse(courseData)
        } catch (error) {
          console.error('Error fetching course:', error);
        }finally{
          setLoading(false)
        }

    
  };

  const paths = usePaths();


  const handleEnrollClick = async () => {
    if (status==="authenticated" && course) {
     setLoading1(true)
      
     try {
      const response = await getParticipant({courseID:course.courseid,token:session.accessToken})
      if (response.id) {
        setError(t("user_has_already_enrolled_to_this_course"));
        setLoading1(false)
        return;
      }
    } catch (error) {
       console.error("user not found")
    }


      try {
      await registerForCourse({ courseCode: course.courseid,token:session.accessToken });
      setSuccess(true)
    } catch (error) {
      setError(t("fail_to_register_participant"))
     }finally{
      setLoading1(false)
     }
      
    }
  };

  return (
    <>
    <section className="hero bg-banner bg-no-repeat py-12 xl:pt-12 xl:pb-12 overflow-hidden">
      <div className="container mx-auto h-full">
        <div className="">
          <div className="flex flex-col items-center">
            <h2 className="h2 mb-6">{t("welcome_to_the_simulation_store")}</h2>
            <div className="col-md-6 col-md-offset-3">
              <div className="">
                <form className="flex items-center max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative w-full">
                    <div className="items-center space-y-5 w-full">
                      <input
                      {...register("courseid", {
                        required: true,
                      })}
                        type="text"
                        className="input focus:outline-none focus:border-blue-500"
                        placeholder={t("enter_the_class_code")}
                      />

                      <button className="btn btn-lg btn-accent mx-auto xl:mx-0"  type="submit">
                      {loading ?  t("searching..."):t("search")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl p-8 pb-16">
    {course ? (
      <>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
              src={`${basePath}/img/store/simulation-1.png`}
              alt=""
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {" "}
                <Link href={`/course_details/${course.id}`}>
                  {" "}
                  {course.course_name}
                </Link>
              </h5>
              <div>
                <h6>{t("By")} :</h6>{" "}
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {`${course.instructor_last_name} ${course.instructor_first_name}`}
                </p>
              </div>
              <div>
                <h6>{t("published_date")}:</h6>{" "}
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {formatDate(course.creation_date)}
                </p>
              </div>

              <div>
                <h6>{t("Course_#_")}:</h6>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {course.courseid}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {status === "authenticated" ? (
                  <button
                    onClick={handleEnrollClick}
                    className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                  >
                    {loading1 ? t("enrolling...") : t("enroll")}
                  </button>
                ) : (
                  <Link
                    className="text-sm text-red-500"
                    href={paths.auth.login.$url()}
                  >
                    {t("you_must_be_registered_to_enroll_in_this_course._Log_in_or_apply_now.")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      <p>{t("no_result")}</p>
    )}
    {success && (
      <p className="mt-4 text-green-500">
        {t("You_have_successfullyregistered_for_the_course.")}
      </p>
    )}
    {error && <span className="text-red-600 text-sm">{error}</span>}
  </section>
  </>
  );
}

export default SectionCourseDetail;
