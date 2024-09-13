'use client'
import { deleteCourse, fetchCourses } from "@/lib/data";
import { course } from "@/lib/data/type";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from 'moment';
import { useTranslation } from "@/app/i18n";

export default function CoursePage({ params: { lng } }:{params: { lng: string };}) {
  const { data: session, status,update } = useSession()
  const router = useRouter()
  const { t } =  useTranslation(lng)
  const [courses, setCourses] = useState<course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    
    if (status === "authenticated") {
      const loadCourses = async () => {
        try {
          const coursesData = await fetchCourses(session.accessToken);
          setCourses(coursesData);

        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      };
      loadCourses();
    }
  }, [status]);

  const handleDelete = async (id: number) => {
    setError("")
    try {
      if(session?.accessToken){
      await deleteCourse(id,session.accessToken);
      const updatedCourses = courses.filter((course: any) => course.id !== id);
      setCourses(updatedCourses);
      }
    } catch (error:any) {
      const code = error.response.data.code
      if (code === 1001) {
        setError(t("please_delete_all_industries_associated_with_this_course_first"))
      }
      console.error('Error deleting course:', error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return redirect(`/${lng}/login`)
  }

  const goToCourse=(courseId:number)=>{

     update({
      ...session,
      courseId
    })
    
  }
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("my_courses")}</h1>
        <Link href={`/${lng}/course/manage`} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          {t("create_new_course")}
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b">{t("name")}</th>
              <th className="p-3 text-left border-b">{t("course_id")}</th>
              <th className="p-3 text-left border-b">{t("simulation")}</th>
              <th className="p-3 text-left border-b">{t("creation_date")}</th>
              <th className="p-3 text-left border-b"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  <Link href={`/${lng}/course/decision/`} onClick={()=>goToCourse(course.id)} className="text-blue-500 hover:underline">
                    {course.course_name}
                  </Link>
                </td>
                <td className="p-3 border-b">{course.courseid}</td>
                <td className="p-3 border-b">{course.simulation_name}</td>
                <td className="p-3 border-b">{moment(course.creation_date).format(lng==='fr' ? 'DD-MM-YYYY':'YYYY-MM-DD')}</td>
                <td className="p-3 border-b">
                  <button 
                  onClick={()=>handleDelete(course.id)}
                  className="text-red-500 hover:underline">{t("delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
      {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
    </div>
  );
}
