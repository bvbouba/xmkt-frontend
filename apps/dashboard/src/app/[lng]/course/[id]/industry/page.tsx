"use client"

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/app/i18n';
import { getCourse, deleteIndustry } from '@/lib/data'; // Assume these functions are defined in your data module
import { useSession } from 'next-auth/react';
import { CourseDetails, Industry } from '@/lib/data/type';
import { calculateTotalParticipants } from '@/lib';
import { useRouter } from 'next/navigation';


export default function IndustryPage ({ params: { lng,id } }:{params: { lng: string,id:number };}) {
  const { t } = useTranslation(lng);
  const { data: session, status } = useSession()
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (id && status === "authenticated") {
      const fetchData = async () => {
        try {
          const courseData = await getCourse(id,session.accessToken);
          setCourse(courseData);
          setIndustries(courseData.industry);
          setTotalParticipants(calculateTotalParticipants(courseData));
          setTotalTeams(courseData.industry.reduce((acc, industry) => acc + industry.number_of_teams, 0))
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [status]);

  const handleDeleteIndustry = async (id: number) => {
    if(status === "authenticated"){
        try {
      await deleteIndustry(id,session?.accessToken);
      setIndustries(industries.filter(industry => industry.id !== id));
    } catch (error:any) {
      const code = error.response.data.code
      if (code === 1001) {
        setError(t("please_delete_all_participants_associated_with_this_industry_first"))
      }
      console.error('Error deleting industry:', error);
    }}
  };

  if (loading) return <p>{t('loading')}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {course && (
        <>
          <h1 className="text-2xl font-semibold mb-6">{course.courseid} - {course.course_name}</h1>

          {/* Information on Your Course Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{t('information_on_your_course')}</h2>
            <table className="min-w-full border border-gray-300">
              {/* <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left">{t('title')}</th>
                  <th className="border-b px-4 py-2 text-left">{t('value')}</th>
                </tr>
              </thead> */}
              <tbody>
                <tr>
                  <td className="border-b px-4 py-2">{t('number_of_industries')}</td>
                  <td className="border-b px-4 py-2">{course.industry.length}</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">{t('number_of_teams')}</td>
                  <td className="border-b px-4 py-2">{totalTeams}</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">{t('number_of_participants_registered')}</td>
                  <td className="border-b px-4 py-2">{totalParticipants}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add or Delete Industries Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t('add_or_delete_industries')}</h2>
            <p className="mb-4">{t('action_message_to_manage_industries')}</p>
            <table className="min-w-full border border-gray-300 mb-4">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left">{t('industry_name')}</th>
                  <th className="border-b px-4 py-2 text-left">{t('number_of_registered_participants')}</th>
                  <th className="border-b px-4 py-2 text-left">{t('delete')}</th>
                </tr>
              </thead>
              <tbody>
                {industries.map(industry => (
                  <tr key={industry.id}>
                    <td className="border-b px-4 py-2">{industry.name}</td>
                    <td className="border-b px-4 py-2">{industry.participant_count}</td>
                    <td className="border-b px-4 py-2">
                      <button
                        onClick={() => handleDeleteIndustry(industry.id)}
                        className="text-red-500 hover:underline"
                      >
                        {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => router.push(`/course/${id}/industry/create`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              {t('create_industry')}
            </button>
          </div>
          <div className="mt-5">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>
            </>
      )}
    </div>
  );
};

