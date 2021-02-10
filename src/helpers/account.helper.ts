import axios from 'axios-income';

export const getAccount = async (login: string) => {
  const result = await axios.get(`/users/${login}.json`);
  return result.data;
};