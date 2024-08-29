import axios from 'axios'
import { API_URI } from 'myconstants';
import { UserType } from 'types';

// auth.ts
export const isAuthenticated = () => {
    // Your authentication logic here, e.g., check for a valid token
    const token = localStorage.getItem('token');
    return !!token;
  };


 export async function getUser(token: string):Promise<UserType | undefined> {
    try {
      const res = await axios.get(`${API_URI}rest-auth/user/`,
        {
          headers: {
                   'Authorization': `token ${token}`
                   }
        })
        const id = res.data.id
        const username = res.data.first_name
        const lastname = res.data.last_name
        const firstname = res.data.first_name
        const email = res.data.email
        const usertype = res.data.profile.user_type
        const country = res.data.profile.country
        const school = res.data.profile.school
        localStorage.setItem('token',token);
        
      return {
        id,
        username,
        lastname,
        firstname,
        email,
        usertype,
        country,
        school
      };
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }