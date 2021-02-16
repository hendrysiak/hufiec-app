import { useEffect } from 'react';
import Cookies from 'universal-cookie';


export const useHandlerLogout = () => {
  const cookies = new Cookies();
  
  const eventClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const token = cookies.get('token');
    if (target.classList.contains('clicked')) {
      cookies.remove('token', {path: '/'});
      return window.location.reload();
    }
    if (token && !target.classList.contains('clicked')) {
      cookies.set('token', token, { path: '/', maxAge: 180 });
      return;
    };
  };
  

  useEffect(() => {
    window.addEventListener('click', eventClick);
    return () => window.removeEventListener('click', eventClick);
  },[]);
};