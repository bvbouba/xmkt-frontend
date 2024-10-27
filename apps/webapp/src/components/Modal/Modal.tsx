import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
}

export const CustomModal: React.FC<ModalProps> = ({ isOpen, closeModal, title, children, onConfirm,}) => {
  const { t } = useTranslation('common');

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="mymodal" overlayClassName="myoverlay">
    <div className="text-gray-400 h-full flex flex-col">
      <div className="flex justify-end">
        <button className="text-red-500 p-2" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className='h-64 overflow-y-auto'>
      <h2 className="text-xl font-bold mb-4 uppercase">{title}</h2>
      {children}
      </div>

      <div className="flex justify-end mt-4 gap-4">
        <button onClick={closeModal} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
          {t("CANCEL")}
        </button>
        {onConfirm && <button onClick={onConfirm} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
          {t("CONFIRM")}
        </button>}
      </div>
    </div>
  </Modal>
  );
};

export default CustomModal;