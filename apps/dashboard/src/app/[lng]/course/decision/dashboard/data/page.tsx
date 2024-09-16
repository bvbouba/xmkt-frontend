'use client'

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@/app/i18n'; // For translations if needed
import dynamic from 'next/dynamic'; // For dynamically importing the chart component
import { useSession } from 'next-auth/react';
import { fetchChartData, getCourse, getDecision } from 'features/data';
import { ChartDataType, Decision, Industry } from 'types';

// Dynamically load the chart component
const DynamicChart = dynamic(() => import('@/components/Chart'), { ssr: false });

interface FormValues {
    chartType: string;
    industry: string;
    period: string;
}

export default function Page({ params: { lng } }: { params: { lng: string; } }) {
    const { t } = useTranslation(lng); // For translating texts
    const { register, handleSubmit, watch } = useForm<FormValues>();
    const [selectedData, setSelectedData] = useState<ChartDataType>();
    const { data: session, status } = useSession();
    const chartType = watch("chartType");
    const industry = watch("industry");
    const period = watch("period");
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [decision, setDecision] = useState<Decision | null>(null);
    const [selectedTitle, setSelectedTitle] = useState('');

    useEffect(() => {
        if ( status === "authenticated") {
            const fetchData = async () => {
                try {
                    const courseData = await getCourse({ courseId: session.courseId, token: session.accessToken, fields: 'industry', industry_fields: 'id,name' });
                    setIndustries(courseData.industry);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [status]);

    useEffect(() => {
        if (industry && status === "authenticated") {
            const getData = async () => {
                try {
                    const decisionData = await getDecision(parseInt(industry), session.accessToken);
                    setDecision(decisionData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            getData();
        }
    }, [industry])

    useEffect(() => {
        if (chartType && industry && period && status === "authenticated") {
            const fetchData = async () => {
                try {
                    const data = await fetchChartData({ chartType, period, industry, token: session.accessToken });
                    setSelectedData(data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }

    }, [status,chartType, industry, period])
   
    const handleSelectChange = (event: any) => {
        const selectedOptionValue = event.target.value;
        
        // Map abbrev to full translation using t()
        const titleMap: { [key: string]: string } = {
            "1": t("spi_evolution"),
            "2": t("retail_sales_market"),
            "3": t("retail_sales_firm"),
            "4": t("market_shares"),
            "5": t("top_selling_brands_volume"),
            "6": t("top_selling_brands_sales"),
            "7": t("revenues_profits"),
            "8": t("expenditures"),
            "9": t("advertising_firm"),
            "10": t("advertising_segment"),
            "11": t("commercial_team_firm"),
            "12": t("commercial_team_channel")
        };

        // Set the full title based on the selected chart type value
        setSelectedTitle(titleMap[selectedOptionValue] || t('choose_chart_type'));
    };



    return (
        <div className="container mx-auto px-4 py-8">
            {/* Industry Name */}
            <h1 className="text-2xl font-semibold text-gray-800"></h1>

            {/* Select Form */}
            <form className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Chart Type Select */}
                    <div>
                        <label htmlFor="chartType" className="block text-sm font-medium text-gray-700">
                            {t('select_chart_type')}
                        </label>
                        <select
                            id="chartType"
                            {...register('chartType', { required: true })}
                            className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleSelectChange}
                        >
                            <option value="">{t('choose_chart_type')}</option>
                            <option value="1">{t('spi_evolution_abbrev')}</option>
                            <option value="2">{t('retail_sales_market_abbrev')}</option>
                            <option value="3">{t('retail_sales_firm_abbrev')}</option>
                            <option value="4">{t('market_shares_abbrev')}</option>
                            <option value="5">{t('top_selling_brands_volume_abbrev')}</option>
                            <option value="6">{t('top_selling_brands_sales_abbrev')}</option>
                            <option value="7">{t('revenues_profits_abbrev')}</option>
                            <option value="8">{t('expenditures_abbrev')}</option>
                            <option value="9">{t('advertising_firm_abbrev')}</option>
                            <option value="10">{t('advertising_segment_abbrev')}</option>
                            <option value="11">{t('commercial_team_firm_abbrev')}</option>
                            <option value="12">{t('commercial_team_channel_abbrev')}</option>
                        </select>
                    </div>

                    {/* Industry Select */}
                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                            {t('select_industry')}
                        </label>
                        <select
                            id="industry"
                            {...register('industry', { required: true })}
                            className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">{t('choose_industry')}</option>
                            {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)
                            }
                        </select>
                    </div>

                    {/* Period Select */}
                    <div>
                        <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                            {t('select_period')}
                        </label>
                        <select
                            id="period"
                            {...register('period', { required: true })}
                            className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >    <option value="">{t('choose_period')}</option>
                            {/* Dynamically generate period options */}
                            {Array.from({ length: decision?.active_period || 0 }).map((_, index) => (
                                <option key={index} value={`${index}`}>
                                    {t(`period`)} {`${index}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>

            {/* Chart Display */}
            <div className="mt-8">
                {selectedData ? (
                    <DynamicChart data={selectedData.data} options={selectedData.options} displayType={selectedData.displayType} chartType={selectedData.chartType} title={selectedTitle} />

                ) : (
                    <p className="text-gray-600">{t('no_data')}</p>
                )}
            </div>
        </div>
    );
}
