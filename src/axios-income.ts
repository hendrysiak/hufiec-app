import axios from 'axios';

import { auth } from 'helpers/db/firebase/firebase';
import { getSession } from 'next-auth/react';

const getAxiosInstance = (() => {
  const currentSession = getSession();
  // const getIdToken = async () => auth.currentUser?.getIdToken();
  const getIdToken = async () => await getSession().then((session) => session?.user?.idToken);

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
