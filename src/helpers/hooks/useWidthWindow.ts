import { useEffect, useState } from 'react';

export const useWidthWindow = () => {
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const handleGetWidth = () => {
      const getWidth = window.screen.width;
      setWidth(getWidth);
    };
    window.addEventListener('resize', handleGetWidth);
    return () => window.removeEventListener('resize', handleGetWidth);
  });

  return width;
};
