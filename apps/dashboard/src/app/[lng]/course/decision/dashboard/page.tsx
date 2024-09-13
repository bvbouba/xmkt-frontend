'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@/app/i18n';
import { useSession } from 'next-auth/react';
import { getCourse, getDecision, getTeamsErrors, updateDecision } from '@/lib/data';
import { Decision, ErrorLog, Industry, IsErrorLog } from '@/lib/data/type';
import ProgressBar from '@/components/ProgressBar'; // Import ProgressBar
import { useRouter } from 'next/navigation';

interface DashboardFormValues {
    industry: string;
}

export default function Page({ params: { lng } }: { params: { lng: string; } }) {
    const { register, watch } = useForm<DashboardFormValues>();
    const { t } = useTranslation(lng);
    const { data: session, status, update } = useSession();
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [decision, setDecision] = useState<Decision | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // Button state
    const industry = watch("industry");
    const [errors, setErrors] = useState<IsErrorLog[]>()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated") {
            const fetchData = async () => {
                try {
                    const courseData = await getCourse({ courseId: session.courseId, token: session.accessToken, fields: "industry", industry_fields: 'id,name,number_of_teams,participant_count' });
                    setIndustries(courseData.industry);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [status]);


    // Function to handle task completion
    const handleTaskComplete = async () => {
        setIsButtonDisabled(false); // Re-enable button after task completion
    };

    useEffect(() => {
        const filtered = industries.find(i => i.id === parseInt(industry));
        if (filtered) {
            setSelectedIndustry(filtered);
        }

        if (industry && status === "authenticated") {
            const getData = async () => {
                try {
                    const decisionData = await getDecision(parseInt(industry), session.accessToken);
                    setDecision(decisionData);
                    const errorData = await getTeamsErrors(parseInt(industry), session.accessToken)
                    setErrors(errorData)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            getData();
        }
    }, [status, industry, isButtonDisabled]);

    const handleActionClick = async () => {
        if (selectedIndustry && decision && status === "authenticated") {
            if (window.confirm(t('confirm_action'))) {
                try {
                    const job = await updateDecision({
                        id: selectedIndustry.id,
                        action: decision.status,
                        token: session.accessToken,
                    });
                    setTaskId(job.task_id);
                    setIsButtonDisabled(true);  // Disable submit button during task progress
                    alert(t('action_successful'));
                } catch (error) {
                    console.error('Error updating decision:', error);
                    alert(t('action_failed'));
                }
            }
        }
    };

    const progressTranslated = (): string => {
        switch (decision?.progress) {
            case "not started":
                return t('not_started');
            case "run":
                return t('run');
            case "in progress":
                return t('in_progress');
            default:
                return decision?.progress || "";
        }
    }

    const actionTranslated = (): string => {
        switch (decision?.action) {
            case "initialize":
                return t('initialize_market');
            case "start":
                return t('start_decision');
            case "run":
                return t('run_decision');
            case "stop":
                return t('stop_decision');
            default:
                return decision?.action || "";
        }
    }

    const handleClick = ({team_id,team_name}:{team_id: number,team_name:string}) => {
        if(decision?.active_period && team_id){ 
            update({
                ...session,
                activePeriod: decision?.active_period,
                teamId: team_id,
                industryId: industry,
                teamName: team_name
              });
        window.open(`/${lng}/course/decision/dashboard/team/`, '_blank')
    }
    }
    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-6">{t('dashboard_title')}</h1>

            <form className="mb-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{t('select_industry')}</label>
                    <select
                        {...register('industry')}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">{t('choose_industry')}</option>
                        {industries.map((industry) => (
                            <option key={industry.id} value={industry.id}>
                                {industry.name}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
            {industry && (
                <button
                    onClick={() => window.open(`/${lng}/course/decision/dashboard/data/`, '_blank')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {t('see_data')}
                </button>
            )}


            {selectedIndustry && (
                <div>
                    <table className="min-w-full divide-y divide-gray-200 mt-6">
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">{t('industry')}</th>
                                <td className="px-2 py-2 text-sm text-gray-500">{selectedIndustry.name}</td>
                            </tr>
                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">{t('number_of_registered_participants')}</th>
                                <td className="px-2 py-2 text-sm text-gray-500">{selectedIndustry.participant_count}</td>
                            </tr>
                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">{t('is_run_decision_enabled')}</th>
                                <td className="px-2 py-2 text-sm text-gray-500">
                                    {selectedIndustry.participant_count < selectedIndustry.number_of_teams ?
                                        <p className='text-red-500 uppercase'>{t("disabled")}</p>
                                        : <p className='text-green-500 uppercase'>{t("enabled")}</p>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">{t('making_decision_for_period')}</th>
                                <td className="px-2 py-2 text-sm text-gray-500">{decision?.active_period}</td>
                            </tr>
                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">{t('current_decision_status')}</th>
                                <td className="px-2 py-2 text-sm text-gray-500">{progressTranslated()}</td>
                            </tr>

                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">
                                    {t('team_errors')}
                                </th>
                                <td className="px-2 py-2 text-sm text-gray-500">
                                    <div className="flex flex-wrap">
                                        {errors?.map((errorLog) => (
                                            <button
                                                key={errorLog.id}
                                                onClick={() => handleClick({team_id:errorLog.id,team_name:errorLog.name})}
                                                className={`w-8 h-8 m-2 text-center flex items-center justify-center rounded-md 
            ${errorLog.has_active_errorlog ? 'bg-red-500' : 'bg-green-500'} text-white font-bold`}
                                                title={t('view_team_decision')}
                                            >
                                                {errorLog.name[0]}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">{t('next_action')}</th>
                                <td className="px-2 py-2 text-sm text-gray-500">
                                    <button
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={handleActionClick}
                                        disabled={isButtonDisabled}
                                    >
                                        {actionTranslated()}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {taskId && status === "authenticated" && (
                <div className="mt-6">
                    {taskId && <ProgressBar taskId={taskId} accessToken={session.accessToken} onComplete={handleTaskComplete} lng={lng} label={actionTranslated()} />}
                </div>
            )}

            {/* Add the notes below the table */}
            {selectedIndustry && <div className="mt-4">
                <p className="text-xs text-gray-500">
                    {t("note_1")}
                </p>
                <p className="text-xs text-gray-500">
                    {t("note_2")}
                </p>
            </div>}
            <div>
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 mt-4 rounded-md shadow-lg"
              onClick={() => router.back()}
            >
              {t("go_back")}
            </button>
            </div>
        </div>
    );
}
