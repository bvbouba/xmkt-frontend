import { useTranslation } from '@/app/i18n';
import { Reimbursement } from 'types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


interface LoanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lng:string
  history: Reimbursement[];
}

export default function LoanHistoryModal({ isOpen, onClose,lng,history }: LoanHistoryModalProps) {
    const { t } = useTranslation(lng);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4">
        <h2 className="text-xl font-semibold mb-4">{t('loan_history')}</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">{t('period')}</th>
              <th className="py-2 px-4 border-b">{t('interest')}</th>
              <th className="py-2 px-4 border-b">{t('principle')}</th>
              <th className="py-2 px-4 border-b">{t('paid')}</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((record, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{record.period}</td>
                <td className="py-2 px-4 border-b">{record.interest}</td>
                <td className="py-2 px-4 border-b">{record.principal}</td>
                <td className="py-2 px-4 border-b">
                {record.paid ? (
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
}
