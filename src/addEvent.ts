import { useEffect } from 'react';

export const AddEvent = (event: string, func: any) => {
  useEffect(() => {
    window.addEventListener('click', func);
  })
  return function cleanup() {
    window.removeEventListener(event, func);
  };
};