import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export interface UseHomeNavigationReturn {
  isModalOpen: boolean;
  modalTitle: string;
  modalMessage: string;
  handleHomeClick: (e?: React.MouseEvent) => void;
  confirmLogout: () => void;
  closeModal: () => void;
}

export const useHomeNavigation = (): UseHomeNavigationReturn => {
  const navigate = useNavigate();
  const { currentUser, currentGovUser, logout, govLogout } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSession, setTargetSession] = useState<'citizen' | 'government' | null>(null);

  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentUser) {
      setTargetSession('citizen');
      setIsModalOpen(true);
    } else if (currentGovUser) {
      setTargetSession('government');
      setIsModalOpen(true);
    } else {
      navigate('/');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTargetSession(null);
  };

  const confirmLogout = () => {
    if (targetSession === 'citizen') {
      logout();
    } else if (targetSession === 'government') {
      govLogout();
    }
    setIsModalOpen(false);
    setTargetSession(null);
    navigate('/');
  };

  const modalTitle =
    targetSession === 'government'
      ? 'Leave Government Portal?'
      : 'Leave Citizen Portal?';

  const modalMessage =
    targetSession === 'government'
      ? 'You are currently signed in to GeoNexus Government Portal. To return to the public home page, you need to log out.'
      : 'You are currently signed in to GeoNexus Citizen Portal. To return to the public home page, you need to log out.';

  return {
    isModalOpen,
    modalTitle,
    modalMessage,
    handleHomeClick,
    confirmLogout,
    closeModal,
  };
};

