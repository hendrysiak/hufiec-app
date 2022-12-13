import axios from 'axios-income';
import { AuthUser } from 'models/users.models';

export const getAccount = async (login: string): Promise<AuthUser | undefined> => {
  const result = await axios.get(`/users/${login}.json`);
  return result.data;
};