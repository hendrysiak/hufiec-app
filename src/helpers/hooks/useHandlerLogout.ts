import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { RootState } from '../../store/models/rootstate.model';
// import 


export const useHandlerLogout = () => {
  const user = useSelector((state: RootState) => state.user);
  const cookies = new Cookies();


  useEffect(() => {
    const eventClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const token = cookies.get('token');
      if (target.classList.contains('clicked')) {
        cookies.remove('token', { path: '/' });
        return window.location.reload();
      }
      if (token) {
        cookies.set('token', token, { path: '/', maxAge: 180 });
        return;
      };
      user.isAuthenticated && window.location.reload();
    };

    window.addEventListener('click', eventClick);
    return () => window.removeEventListener('click', eventClick);
  },[user]);
};