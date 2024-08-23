import axios from 'axios';
import { API_URI } from 'myconstants';

const api = axios.create({
  baseURL: `${API_URI}api`, // Replace with your API base URL
});

export const fetchData = async (endpoint:string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};