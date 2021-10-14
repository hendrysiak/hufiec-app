import BungalowIcon from '@mui/icons-material/Bungalow';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import React from 'react';

export const useGeneratedIcon = (type: 'tent' | 'bungalow' | 'old-bungalow'): JSX.Element => {
  switch (type) {
    case 'tent':
      return <ParkIcon />;
    case 'bungalow':
      return <HomeIcon />;
    case 'old-bungalow':
      return <BungalowIcon />;
  }
};