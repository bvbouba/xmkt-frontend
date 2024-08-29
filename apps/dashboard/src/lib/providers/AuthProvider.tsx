"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthTimeout, logout } from 'features/authSlices';
import axios from 'axios';
import { API_URI } from 'myconstants';
import { useAppDispatch } from '@/lib/hooks/redux';

type User = {
  userName: string;
  lastName: string;
  firstName: string;
  userType: string;
  country: string;
  school: string;
};

// Create AuthContext
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility function for fetching user data
const fetchUserData = async (token: string) => {
  try {
    const response = await axios.get(`${API_URI}rest-auth/user/`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// AuthProvider component
export const AuthProvider = ({
  children,
  isAuthenticated,
  lng,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  lng: string;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch(logout());
      router.push(`/${lng}/login/`);
      return;
    }

    const storedExpirationDate = localStorage.getItem('expirationDate');
    if (storedExpirationDate) {
      const expirationDate = new Date(storedExpirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
        router.push(`/${lng}/login/`);
        return;
      }

      // Fetch user data and update state
      fetchUserData(token).then((userData) => {
        if (userData) {
          const { last_name, first_name, user_type, country, school } = userData;
          setUser({
            userName: first_name,
            lastName: last_name,
            firstName: first_name,
            userType: user_type,
            country: country,
            school: school,
          });
          dispatch(
            checkAuthTimeout(
              (expirationDate.getTime() - new Date().getTime()) / 1000
            )
          );
        } else {
          setUser(null);
          router.push(`/${lng}/login/`);
        }
      });
    } else {
      setUser(null);
      router.push(`/${lng}/login/`);
    }
  }, [isAuthenticated, lng, router, dispatch]);
  console.log("helloo")
  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
