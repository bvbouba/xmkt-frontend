import formatDate from "@/lib/date";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import usePaths from "@/lib/paths";
import { useAuth } from "@/lib/providers/AuthProvider";
import { registerForCourse } from "features/storeSlices";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function SectionCourseDetail() {
  const { t } = useTranslation("common");
  const {data:course } = useAppSelector((state) => state.store.course);
  const {data:enroll, loading:eloading,success } = useAppSelector((state) => state.store.enroll);

  const { isAuthenticated } = useAuth();
  const paths = usePaths();
  const dispatch = useAppDispatch(); // Redux dispatch

  const handleEnrollClick = () => {
    if (course) {
      dispatch(registerForCourse({ courseCode: course.courseid }));
    }
  };

  return (
    <section className="mx-auto max-w-7xl p-8 pb-16">
    {course ? (
      <>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
              src="/img/store/simulation-1.png"
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
                <h6>{t("Published date")}:</h6>{" "}
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {formatDate(course.creation_date)}
                </p>
              </div>

              <div>
                <h6>{t("Course # ")}:</h6>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {course.courseid}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleEnrollClick}
                    className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                  >
                    {eloading ? t("Enrolling...") : t("Enroll")}
                  </button>
                ) : (
                  <Link
                    className="text-sm text-red-500"
                    href={paths.auth.login.$url()}
                  >
                    {t(
                      "You must be registered to enroll in this course. Log in or apply now."
                    )}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      <p>No result</p>
    )}
    {success && (
      <p className="mt-4 text-green-500">
        {t("You have successfully registered for the course.")}
      </p>
    )}
  </section>
  );
}

export default SectionCourseDetail;
