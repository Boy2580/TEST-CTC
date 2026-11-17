import axios from 'axios';
import { API_BASE_URL } from './authApi';

export const setNameApi = async (username: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_BASE_URL}/setName`,
    { username },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};