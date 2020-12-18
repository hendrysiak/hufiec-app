import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://finance-zhprsl.firebaseio.com/',
});

export default instance;