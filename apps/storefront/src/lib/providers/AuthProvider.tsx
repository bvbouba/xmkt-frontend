
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import usePaths from '../paths';
import { useAppDispatch } from '../hooks/redux';
import {checkAuthTimeout, logout } from 'features/authSlices';
import axios from 'axios';
import { API_URI } from 'myconstants';



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

// AuthProvider component
export const AuthProvider= ({ children,isAuthenticated }: { children: React.ReactNode,isAuthenticated:boolean }) => {
  const router = useRouter();
  const paths = usePaths()
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token)  {
        dispatch(logout());
        return
      }
      const storedExpirationDate = localStorage.getItem("expirationDate");

      if (storedExpirationDate) {
        const expirationDate = new Date(storedExpirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
        return
      }

        try {
          const response = await axios.get(
          `${API_URI}rest-auth/user/`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        )

            const userData = await response.data;
            const {last_name, first_name, user_type, country, school } = userData;
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
          
        } catch (error) {
          console.error('Error fetching data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);



  return (
    <AuthContext.Provider value={{ isAuthenticated,user}}>
      {children}
    </AuthContext.Provider>
  );
};