import formatDate from "@/lib/date";
import { fetchCoursesById } from "features/data";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CourseProps } from "types";
import Link from "next/link";

type FormValues = {
  courseid: string;
};

export function SectionCourseDetail() {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
  } = useForm<FormValues>();
  const [course, setCourse] = useState<CourseProps>();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/store";
  const [error, setError] = useState<string>();

  const onSubmit = async (data: FormValues) => {
    const { courseid } = data;
    setLoading(true);
    try {
      const courseData = await fetchCoursesById({ courseid });
      setCourse(courseData);
    } catch (error) {
      console.error("Error fetching course:", error);
      setError(t("no_result"));
    } finally {
      setLoading(false);
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
                          {...register("courseid", { required: true })}
                          type="text"
                          className="input focus:outline-none focus:border-blue-500"
                          placeholder={t("enter_the_class_code")}
                        />
                        <button className="btn btn-lg btn-accent mx-auto xl:mx-0" type="submit">
                          {loading ? t("searching...") : t("search")}
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
        <Link href={`/course-details/${course.courseid}`}>
          <div className="flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl hover:shadow-lg transition-shadow duration-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer">
            <div className="h-32 w-32 md:h-48 md:w-48 relative flex-shrink-0">
              <img
                className="object-cover h-full w-full rounded-t-lg md:rounded-none md:rounded-l-lg"
                src={`${basePath}/img/store/simulation-1.png`}
                alt="Course"
              />
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {course.course_name}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("By")} {`${course.instructor_first_name} ${course.instructor_last_name}`}
                </p>
              </div>
              <div className="flex flex-col justify-between w-full mt-3 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <span>{t("published_date")}:</span>{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(course.creation_date)}
                  </span>
                </div>
                <div>
                  <span>{t("course_#_")}:</span>{" "}
                  <span className="font-medium text-gray-900 dark:text-white">{course.courseid}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  ) : (
    <p>{error || t("no_result")}</p>
  )}
</section>

    </>
  );
}

export default SectionCourseDetail;
