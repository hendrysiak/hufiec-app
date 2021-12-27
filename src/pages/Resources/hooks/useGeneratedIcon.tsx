import BungalowIcon from '@mui/icons-material/Bungalow';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import HouseIcon from '@mui/icons-material/House';
import ParkIcon from '@mui/icons-material/Park';
import React from 'react';

export const useGeneratedIcon = (type: 'tent' | 'bungalow' | 'old-bungalow' | 'house' | 'main'): JSX.Element => {
  switch (type) {
    case 'tent':
      return <ParkIcon />;
    case 'bungalow':
      return <HomeIcon />;
    case 'old-bungalow':
      return <BungalowIcon />;
    case 'house':
      return <HouseIcon />;
    case 'main':
      return <BusinessIcon />;
  }
};