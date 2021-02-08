import { useEffect } from 'react';


export const AddEvent = (action: string, func: () => void) => {
  useEffect(() => {
    window.addEventListener('click', func);
  });
  return function cleanup() {
    window.removeEventListener(action, func);
  };
};