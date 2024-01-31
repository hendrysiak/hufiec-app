import axios from 'axios';

import { auth } from 'helpers/db/firebase/firebase';

const getAxiosInstance = (() => {
  const getIdToken = async () => auth.currentUser?.getIdToken();

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DB_URL,
  });

  instance.interceptors.request.use(async (config) => {
    config.params = {
      auth: await getIdToken(),
    };
    return config;
  });

  return instance;
})();

export default getAxiosInstance;
