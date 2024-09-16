
import { useForm, SubmitHandler } from 'react-hook-form';
import { SetStateAction, useState } from 'react';
import { useTranslation } from '@/app/i18n';
import { useSession } from 'next-auth/react';
import { createLoan } from 'features/data';

interface LoanFormData {
    rate: number;
    principal: number;
    number_of_periods: number;
}

export default function Form({ lng, setIsLoanFormOpen }: { lng: string, setIsLoanFormOpen: (value: SetStateAction<boolean>) => void }) {
    const { t } = useTranslation(lng);
    const { register, handleSubmit, formState: { errors } } = useForm<LoanFormData>();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState<boolean>();
    const [error, setError] = useState<string>();
    const token = session?.accessToken;
    const period = session?.activePeriod || 0
    const industry = session?.industryId
    const team = session?.teamId
    const leftPeriod = 10 - period

    const onSubmit: SubmitHandler<LoanFormData> = async (data) => {

        if (window.confirm(t("are_you_sure_you_want_to_grant_this_loan"))) {
            const { rate, principal, number_of_periods } = data
            setLoading(true)
            if (token && period && industry && team) {
                try {
                    await createLoan({ rate, period, principal, number_of_periods, industry, team, token })
                    setIsLoanFormOpen(false);
                } catch (error) {
                    console.error('Error submitting course:', error);
                    setError(t("loan_creation_failed"));
                }
            }
            setLoading(false);
            setIsLoanFormOpen(false);
        } else {
            console.log("Form submission cancelled.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-xl font-semibold mb-4">{t('add_loan')}</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block mb-2">{t('rate')}</label>
                        <select {...register('rate', { required: true })} className="border p-2 rounded w-full">
                            <option value={0.03}>3%</option>
                            <option value={0.04}>4%</option>
                            <option value={0.05}>5%</option>
                        </select>
                        {errors.rate && <p className="text-red-500">{t('rate_required')}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">{t('principal')}</label>
                        <input
                            type="number"
                            {...register('principal', {
                                required: true, min: 0,
                                max: {
                                    value: 5000,
                                    message: t("principal_must_be_less_than_or_equal_to_5000"),
                                },

                            })}
                            className="border p-2 rounded w-full"
                        />
                        {errors.principal && <p className="text-red-500">{t('principal_required')}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">{t('number_of_periods')}</label>
                        <input
                            type="number"
                            {...register('number_of_periods',
                                {
                                    required: true,
                                    min: 1,
                                    validate: {
                                        lessThanAllowed: value =>
                                            value < leftPeriod ||
                                            t("number_of_periods_must_be_less_than", { leftPeriod: leftPeriod }),
                                    },
                                })}
                            className="border p-2 rounded w-full"
                        />
                        {errors.number_of_periods && <p className="text-red-500">{t('number_of_periods_required')}</p>}
                    </div>


                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2">
                            {t('submit')}
                            {loading && "...."}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLoanFormOpen(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                        >
                            {t('cancel')}
                        </button>
                    </div>
                    <div className=''>
                    {error && <span className="text-red-600 text-sm">{error}</span>}
                    </div>
                </form>
            </div>
        </div>
    )
}