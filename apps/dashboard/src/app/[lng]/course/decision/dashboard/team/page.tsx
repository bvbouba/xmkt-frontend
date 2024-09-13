// page.ts
'use client'

import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n';
import { BudgetDetails, ErrorLog, Loans, MarketingMixType, Reimbursement } from '@/lib/data/type';
import { useSession } from 'next-auth/react';
import { fetchMarketingMixDecisionByTeam, getBudgetDetail, getErrorLogByTeam, getLoansByTeam, getReimbursementsByTeam } from '@/lib/data';
import LoanHistoryModal from '@/components/LoanHistoryModal';
import Form from './form';


export default function Page({ params: { lng } }: { params: { lng: string; } }) {
  const { t } = useTranslation(lng);
  const [teamDecision, setTeamDecision] = useState<MarketingMixType[]>();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [budget, setBudget] = useState<BudgetDetails>();
  const [loans, setLoans] = useState<Loans[]>([]);  
  const [loanHistory, setLoanHistory] = useState<Reimbursement[]>([]);  
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);  
  const { data: session, status } = useSession();
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false); 
  
  useEffect(() => {
    if ( status === "authenticated") {
      const fetchData = async () => {
        try {
          const decisionData = await fetchMarketingMixDecisionByTeam({
            teamId: session.teamId,
            token: session.accessToken,
            period: session.activePeriod,
            fields: "brand_name,advertising,price,production,channel_1,channel_2,channel_3,commercial_cost"
          });
          setTeamDecision(decisionData);

          const errorData = await getErrorLogByTeam({
            teamId: session.teamId,
            token: session.accessToken,
            period: session.activePeriod
          });
          setErrors(errorData);

          const budgetData = await getBudgetDetail({
            teamId: session.teamId,
            token: session.accessToken,
            period: session.activePeriod
          });
          setBudget(budgetData);

          const loanData = await getLoansByTeam({
            teamId: session.teamId,
            token: session.accessToken
          });
          setLoans(loanData);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }

  }, [status]);

  const viewLoanHistory = async (loanId: number) => {
    if (loanId && status === "authenticated") {
      const fetchData = async () => {
          try {
              const historyData = await getReimbursementsByTeam({ loanId, token: session.accessToken });
              setLoanHistory(historyData);
              setIsHistoryModalOpen(true); 
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData();
  }
 
  };


  if (!teamDecision || !budget ) {
    return <p>{t('loading')}...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t('team_decision_summary')} - {session?.teamName}</h1>

      {/* Marketing Mix Section */}
      <h2 className="text-xl font-semibold mb-4">{t('marketing_mix')}</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">{t('brand_name')}</th>
            <th className="py-2 px-4 border-b">{t('advertising')}</th>
            <th className="py-2 px-4 border-b">{t('price')}</th>
            <th className="py-2 px-4 border-b">{t('production')}</th>
            <th className="py-2 px-4 border-b">{t('channel_1')}</th>
            <th className="py-2 px-4 border-b">{t('channel_2')}</th>
            <th className="py-2 px-4 border-b">{t('channel_3')}</th>
          </tr>
        </thead>
        <tbody>
          {teamDecision.map((brand,index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b">{brand.brand_name}</td>
              <td className="py-2 px-4 border-b">{brand.advertising}</td>
              <td className="py-2 px-4 border-b">{brand.price}</td>
              <td className="py-2 px-4 border-b">{brand.production}</td>
              <td className="py-2 px-4 border-b">{brand.channel_1}</td>
              <td className="py-2 px-4 border-b">{brand.channel_2}</td>
              <td className="py-2 px-4 border-b">{brand.channel_3}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Budget Details Section */}
      <h2 className="text-xl font-semibold mt-8 mb-4">{t('budget_details')}</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">{t('budget')}</td>
            <td className="py-2 px-4 border-b">{budget.budget}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">{t('expenses')}</td>
            <td className="py-2 px-4 border-b">{budget.expenses}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">{t('loans')}</td>
            <td className="py-2 px-4 border-b">{budget.loans}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">{t('deviation')}</td>
            <td className={`py-2 px-4 border-b ${budget.deviation < 0 ? 'text-red-500' : ''}`}>
              {budget.deviation}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Loans Section */}
      <h2 className="text-xl font-semibold mt-8 mb-4">{t('loans')}</h2>
       {/* Button to add a loan */}
       <div className='mb-2'>
       <button
          onClick={() => setIsLoanFormOpen(true)}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          {t('add_loan')}
        </button>
        </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">{t('period')}</th>
            <th className="py-2 px-4 border-b">{t('rate')}</th>
            <th className="py-2 px-4 border-b">{t('principle')}</th>
            <th className="py-2 px-4 border-b">{t('number_of_periods')}</th>
            <th className="py-2 px-4 border-b">{t('is_active')}</th>
            <th className="py-2 px-4 border-b">{t('history')}</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan,index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b">{loan.period}</td>
              <td className="py-2 px-4 border-b">{loan.rate}</td>
              <td className="py-2 px-4 border-b">{loan.principal}</td>
              <td className="py-2 px-4 border-b">{loan.number_of_periods}</td>
              <td className="py-2 px-4 border-b">{loan.is_active ? t('yes') : t('no')}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => viewLoanHistory(loan.id)} className="text-blue-500 underline">
                  {t('view')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoanFormOpen && 
      <Form  lng={lng} setIsLoanFormOpen={setIsLoanFormOpen}/>
      }

      {/* Loan History Modal */}
      {isHistoryModalOpen && (
        <LoanHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          lng={lng}
          history={loanHistory}

        />
      )}

       {/* Error Section */}
       <h2 className="text-xl font-semibold mt-8 mb-4">{t('current_errors')}</h2>
      {errors?.length > 0 ? (
        <ul className="list-disc pl-5">
          {errors.map((error, index) => (
            <li key={index} className={`text-${error.severity === 1 ? 'red' : 'yellow'}-500`}>
              {t('error_message')}: {lng === 'fr' ? error.content_fr : error.content} ({t('severity')}: {error.severity})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-green-500">{t('no_errors')}</p>
      )}


    </div>
  );
}
