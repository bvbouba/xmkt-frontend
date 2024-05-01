
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import usePaths from '../paths';
import { useAppDispatch } from '../hooks/redux';
import {checkAuthTimeout, logout } from 'features/authSlices';
import axios from 'axios';
import { errorLogProps } from 'features/participantSlices';
import { BudgetDetailsProps } from "types"


type User = {
  userName: string;
  lastName: string;
  firstName: string;
  userType: string;
  country: string;
  school: string;
};

type ParticipantProps = {
  userID: number;
    teamID: number;
    teamName: string;
    courseID: number;
    courseCode: string;
    industryName: string;
    industryID: number;
    activePeriod: number;
    instructorID: number;
    firmID: number;
};

// Create AuthContext
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  participant: ParticipantProps | null;
  errorLog: errorLogProps[];
  budget: BudgetDetailsProps | null;
  setSelectedPeriod: (value: SetStateAction<number>) => void 
  selectedPeriod:number;
  setRefresh: Dispatch<SetStateAction<number>>
  // login: () => void;
  // logout: () => void;
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
  const [participant, setParticipant] = useState<ParticipantProps | null>(null);
  const [errorLog, setErrorLog] = useState<errorLogProps[]>([])
  const [budget, setBudget] = useState<BudgetDetailsProps|null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);
  const [refresh,setRefresh]=useState<number>(0)
  

  useEffect(()=>{

    const fetchData = async ({ teamID,period }: { teamID: number,period:number }) =>
    { try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/analyze/errorlog/${teamID}/${period}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      const response1 = await axios.get(
        `http://127.0.0.1:8000/api/budget-details/${teamID}/${period}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      
      setErrorLog(response.data)
      console.log(response.data)
      setBudget(response1.data)
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setErrorLog([])
    }}
    if(participant?.teamID && participant?.activePeriod){
        fetchData({teamID:participant?.teamID,period:participant?.activePeriod})
    }

  },[participant?.teamID,participant?.activePeriod,refresh])

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const  pass = localStorage.getItem("pak"); 

      if (!token || !pass)  {
        dispatch(logout());
        router.push(paths.auth.login.$url()); 
      }
      const storedExpirationDate = localStorage.getItem("expirationDate");

      if (storedExpirationDate) {
        const expirationDate = new Date(storedExpirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
        router.push(paths.auth.login.$url()); 
      }

        try {
          const response = await axios.get(
          "http://127.0.0.1:8000/rest-auth/user/",
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


            const response1 = await axios.get(
              `http://127.0.0.1:8000/api/participant_detail/${pass}/`
            );
            
            const userID = response1.data.user;
            const teamID = response1.data.team[0] ?? null;
            const teamName = response1.data.team_name;
            const courseID = response1.data.course;
            const courseCode = response1.data.courseid;
            const industryName = response1.data.industry_name;
            const industryID = response1.data.industry_id;
            const activePeriod = response1.data.active_period;
            const instructorID = response1.data.instructor;
            const firmID = response1.data.firm_id;
            setParticipant({
              userID,
              teamID,
              teamName,
              courseID,
              industryName,
              industryID,
              activePeriod,
              instructorID,
              firmID,
              courseCode,
            });
            setSelectedPeriod(activePeriod-1)
          
          const response2 = await axios.get(`http://127.0.0.1:8000/api/analyze/errorlog/${teamID}/${activePeriod}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
          
        } catch (error) {
          console.error('Error fetching data:', error);
          setUser(null);
          setParticipant(null);
        }
      } else {
        setUser(null);
        setParticipant(null);
        router.push(paths.auth.login.$url()); // Redirect to your login page
      }
    };

    fetchUserData();
  }, [isAuthenticated]);



  return (
    <AuthContext.Provider value={{ isAuthenticated,user,participant,setSelectedPeriod,selectedPeriod,errorLog,budget,setRefresh}}>
      {children}
    </AuthContext.Provider>
  );
};