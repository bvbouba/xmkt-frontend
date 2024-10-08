'use client';

import { useTranslation } from "@/app/i18n";
import { calculateTotalParticipants } from "@/lib";
import { getCourse } from "features/data";
import { CourseDetails } from "types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseDetailsPage({ params: { lng } }:{params: { lng: string };}) {
  const { t } = useTranslation(lng);
  const { data: session, status } = useSession()
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetails>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if (status === "authenticated") {
      const loadCourse = async () => {
        try {
          const coursesData = await getCourse({courseId:session.courseId,token:session.accessToken});
          setCourse(coursesData);

        } catch (error) {
          console.error('Error getting course:', error);
        } finally {
          setLoading(false);
        }
      };
      loadCourse();
    }
  }, [status]);

  const handleEditCourse = () => {
    router.push(`/${lng}/course/edit`);
  };

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return redirect(`/${lng}/login`)
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
        {/* Course Name and Edit Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{course?.courseid} - {course?.course_name}</h1>
          <Link
           href={`/${lng}/course/manage/${course?.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
           {t("edit_course")}
          </Link>
        </div>

        {/* Number of Participants */}
        <div>
          <p className="text-lg">
            {course?.registered_participants} {t("registered_participants")}
          </p>
        </div>

        {/* Set Up Your Course Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{t("set_up_your_course")}</h2>
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              {t("action_for_creating_industries")}.
            </p>
            <div className="mt-3">
            <Link href={`/${lng}/course/decision/industry`} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">
              {t("create_industries")}
            </Link>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              {t("action_for_forming_teams")}.
            </p>
            <div className="mt-3">
            <Link href={`/${lng}/course/decision/team`} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">
              {t("form_teams")}
            </Link>
            </div>
          </div>
        </div>

        {/* Manage Your Course Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{t("manage_your_course")}</h2>
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              {t("action_for_the_decision_round_dashboard")}.
            </p>
            <div className="mt-3">
            <Link href={`/${lng}/course/decision/dashboard`} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-lg">
              {t("decision_round_dashboard")}
            </Link>
            </div>
          </div>
        </div>

        {/* Industry and Teams Table */}
        <div className="mt-6">
  <h2 className="text-xl font-semibold">{t("industries_teams")}</h2>
  <table className="min-w-full bg-white border border-gray-300 mt-4">
    <thead>
      <tr>
        <th className="px-4 py-2 border-b text-left">{t("industry_name")}</th>
        <th className="px-4 py-2 border-b text-left">{t("team_name")}</th>
        <th className="px-4 py-2 border-b text-left">{t("team_password")}</th>
      </tr>
    </thead>
    <tbody>
      {course?.industry.map((industry) => (
        industry.teams.map(team => (
          <tr key={team.id}>
            <td className="px-4 py-2 border-b text-left">{industry.name}</td>
            <td className="px-4 py-2 border-b text-left">{team.name}</td>
            <td className="px-4 py-2 border-b text-left">{team.password}</td>
          </tr>
        ))
      ))}
    </tbody>
  </table>
</div>
      </div>
    </div>
  );
}