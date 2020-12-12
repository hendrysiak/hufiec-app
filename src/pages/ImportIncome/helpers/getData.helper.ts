import axios from 'axios';

import { INGBiling } from '../models/ing.biling.model';

export const getJsonFromServer = async (url: string): Promise<INGBiling> => {
  const result = await axios.get(url);
  return result.data;
};