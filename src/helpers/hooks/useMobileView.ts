import { useState, useEffect } from 'react';

export const useMobileView = (min = 320, max = 568): boolean => {
  const queryToMatch = `(min-width: ${min}px) and (max-width: ${max}px)`;
  const [matches, setMatches] = useState(window.matchMedia(queryToMatch).matches);

  useEffect(() => {
    const media = window.matchMedia(queryToMatch);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, queryToMatch]);

  return matches;
};