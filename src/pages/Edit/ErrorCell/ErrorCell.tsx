import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Tooltip, FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';

import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';

import React from 'react';

import { ErrorType, ErrorTypesMap } from 'models/error.types.model';

export const ErrorIcon = ({ error }: { error: ErrorType }): JSX.Element => {
  let errorIcon = <></>;
  if (error === ErrorType.EventError) errorIcon = <ExploreOffIcon />;
  if (error === ErrorType.NameError) errorIcon = <PersonOffIcon />;
  if (error === ErrorType.YearError) errorIcon = <HourglassDisabledIcon />;
  if (error === ErrorType.TeamError) errorIcon = <GroupRemoveIcon />;
  
  
  return (<Tooltip style={{ margin: '0 8px' }} title={ErrorTypesMap[error]} placement="top">{errorIcon}</Tooltip>);
};
  
  
export const ErrorCheckboxesEditCell = ({ params } : { params: GridRenderCellParams<string> }): JSX.Element => {
  const values = params.value?.split(',') ?? [];
  
  const { id, field } = params;
  const apiRef = useGridApiContext();
  
  const handleValueChange = (checked: boolean, error: string) => {
    const newValue = checked ? [...values, error] : values.filter(el => el !== error);
    apiRef.current.setEditCellValue({ id, field, value: newValue.join(',') });
  };
  
  return <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>{Object.entries(ErrorTypesMap).map(([error, label]) => {
    return (
      <FormControlLabel 
        key={error} 
        labelPlacement="top" 
        label={label} 
        control={<Checkbox
          checked={values.includes(error as ErrorType)}
          value={error}
          size="small"
          onChange={(e) => handleValueChange(e.target.checked, error)}
          color="primary"
        />} 
      />);
  })}
  </FormGroup>;
    
};
export const ErrorCheckboxesViewCell = ({ params } : { params: GridRenderCellParams<string> }): JSX.Element => {
  return (<Box>
    {params.value?.split(',')?.map((error: string) => <ErrorIcon key={error} error={error as ErrorType} />)}
  </Box>);
};

export const ErrorDispllayCell = ({ errors, className }: { errors: ErrorType[] | undefined, className?: string }): JSX.Element => {
  if (!errors) return <Box className={className}></Box>;

  return (<Box className={className} display="flex" justifyContent="center" >
    {errors.map((error: string) => <ErrorIcon key={error} error={error as ErrorType} />)}
  </Box>);
};