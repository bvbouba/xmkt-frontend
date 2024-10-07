import { useState, useEffect, ReactElement } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { InferGetStaticPropsType } from "next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Participant } from "types";
import { getAllEnrolledCourses } from "features/data";
import { StoreLayout } from "@/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale || context.defaultLocale || "en";
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      locale,
    },
  };
};

export default function Page({
  locale,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { t } = useTranslation("common");
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchCourses = async () => {
      if (session) {
        try {
          const token = session.accessToken as string;
          const enrolledCourses = await getAllEnrolledCourses(token);
          setCourses(enrolledCourses);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setError(t("no_result"));
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [session, t]);

  const decodePassword = (encodedPassword: string): string => {
    try {
      return atob(encodedPassword);
    } catch (e) {
      return t("invalid_password");
    }
  };

  const togglePasswordVisibility = (courseId: number) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [courseId]: !prevState[courseId],
    }));
  };

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="container mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-8">{t("my_courses")}</h1>
      {courses.length === 0 ? (
        <p>{t("no_courses_found")}</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">{t("course_name")}</th>
              <th className="border border-gray-200 p-2">{t("courseid")}</th>
              <th className="border border-gray-200 p-2">{t("puk")}</th>
              <th className="border border-gray-200 p-2">{t("team_password")}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="border border-gray-200 p-2">{course.course_name}</td>
                <td className="border border-gray-200 p-2">{course.courseid}</td>
                <td className="border border-gray-200 p-2">{course.puk}</td>
                <td className="border border-gray-200 p-2">
                  <div className="flex items-center">
                    {showPasswords[course.id]
                      ? decodePassword(course.team_password)
                      : "••••••"}
                    <button
                      onClick={() => togglePasswordVisibility(course.id)}
                      className="ml-2"
                    >
                      {showPasswords[course.id] ? (
                        <FontAwesomeIcon 
                        icon={faEyeSlash} 
                        className="h-5 w-5 text-gray-600"
                    />
                      ) : (
                        <FontAwesomeIcon 
                        icon={faEye} 
                        className="h-5 w-5 text-gray-600"
                    />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
    return <StoreLayout>{page}</StoreLayout>;
  };