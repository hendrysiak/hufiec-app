import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';


export const checkColumnRenderer = (params: GridRenderCellParams<string | boolean | undefined>): JSX.Element => (
  <Box style={{ width: '100%' }} display="flex" justifyContent="center">
    {params.value ? <CheckIcon /> : <CloseIcon />}
  </Box>
);
export const checkOldColumnRenderer = (param: boolean | undefined | null): JSX.Element => (
  <Box style={{ width: '100%' }} display="flex" justifyContent="center">
    {param ? <CheckIcon /> : <CloseIcon />}
  </Box>
);