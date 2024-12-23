import formatDate from "@/lib/date";
import { fetchCoursesById, getParticipant, registerForCourse } from "features/data";
import { useSession } from "next-auth/react";
import { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { StoreLayout } from "@/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale || "fr";
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
    const { data: session, status } = useSession();
    const router = useRouter();
    const { courseId } = router.query;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingEnroll, setLoadingEnroll] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails(courseId as string);
        }
    }, [courseId]);

    const fetchCourseDetails = async (courseid: string) => {
        setLoading(true);
        try {
            const courseData = await fetchCoursesById({ courseid });
            setCourse(courseData);
        } catch (error) {
            console.error("Error fetching course details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollClick = async () => {
        if (status === "authenticated" && course) {
            setLoadingEnroll(true);
            try {
                const response = await getParticipant({ courseID: course.courseid, token: session.accessToken });
                if (response.id) {
                    setError(t("user_has_already_enrolled_to_this_course"));
                    setLoadingEnroll(false);
                    return;
                }
            } catch (error) {
                console.error("User not found, proceeding with enrollment.");
            }

            try {
                await registerForCourse({ courseCode: course.courseid, token: session.accessToken });
                setSuccess(true);
            } catch (error) {
                setError(t("fail_to_register_participant"));
            } finally {
                setLoadingEnroll(false);
            }
        }
    };

    if (loading) {
        return <p>{`...${t("loading")}`}</p>;
    }

    if (!course && !loading) {
        return <p>{t("course_not_found")}</p>;
    }

    return (
        <section className="mx-auto max-w-6xl p-8 pb-16">
       

            {/* Course Information Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 md:flex">
                {/* Image Section */}
                <div className="md:w-1/3">
                    <img
                        className="w-full h-64 object-cover md:h-full"
                        src={`/img/store/simulation-1.png`}
                        alt={course.course_name}
                    />
                </div>

                {/* Info Section */}
                <div className="p-8 md:w-2/3">
                    {success ? (
                        <>
                            <h2 className="text-2xl font-bold text-green-600 mb-4">
                                {t("you_have_successfully_registered_for_the_course!")}
                            </h2>
                    
                            <p className="text-gray-700 mb-4">
                                {t("the_instructor_will_provide_the_course_password.")}
                            </p>
                            <p className="text-gray-700">
                                {t("later_you_can_access_this_course_and_all_details_in_the")} <Link href="/my-courses" className="text-blue-500 hover:underline">{t("my_courses")}</Link> {t("section")}.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {course.course_name}
                            </h2>

                            <div className="flex items-center mb-2">
                                <FontAwesomeIcon 
                                    icon={faUser} 
                                    className="h-5 w-5 text-gray-500 me-2"
                                />
                                <p className="text-gray-700">{`${course.instructor_last_name} ${course.instructor_first_name}`}</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <FontAwesomeIcon 
                                    icon={faCalendar} 
                                    className="h-5 w-5 text-gray-500 me-2"
                                />
                                <p className="text-gray-700">{`${t("published_date")}: ${formatDate(course.creation_date)}`}</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <FontAwesomeIcon 
                                    icon={faBookOpen} 
                                    className="h-5 w-5 text-gray-500 me-2"
                                />
                                <p className="text-gray-700">{`${t("course_id")}: ${course.courseid}`}</p>
                            </div>

                            {/* Enrollment Button */}
                            {status === "authenticated" ? (
                                <button
                                    onClick={handleEnrollClick}
                                    className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition duration-300"
                                >
                                    {loadingEnroll ? t("enrolling...") : t("enroll_now")}
                                </button>
                            ) : (
                                <Link href="/auth/login" className="mt-6 w-full text-center text-red-500 font-semibold block">
                                        {t("you_must_be_registered_to_enroll_in_this_course._log_in_or_apply_now")}
                                
                                </Link>
                            )}

                            {/* Success/Error Messages */}
                            {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {  
    return {
        paths: [],
        fallback: true,
    };
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <StoreLayout>{page}</StoreLayout>;
  };
