import { Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { GridRenderCellParams, useGridApiContext } from "@mui/x-data-grid";
import { useTeams } from "helpers/hooks/useTeams";
import { ErrorTypesMap, ErrorType } from "models/error.types.model";

export function TeamMultiCheckboxesEditCell({ params }: { params: GridRenderCellParams<number[]> }): JSX.Element {
    const teamsMap = useTeams();
    console.log(params);
    const values: number[] = params.value ?? [];
  
    const { id, field } = params;
    const apiRef = useGridApiContext();
  
    const handleValueChange = (team: string | number[]) => {
        console.log(team);
      
      const newValue =  typeof team === 'string' ? team.split(',') : team;
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };
  
    return (
        <Select
            multiple
            value={values}
            onChange={(e) => handleValueChange(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
            variant='standard'
            style={{ width: '100%' }}
            // MenuProps={MenuProps}
          >
            {teamsMap.map((team) => (
              <MenuItem key={team.teamId} value={team.teamId}>
                <Checkbox checked={values.includes(team.teamId)} />
                <ListItemText primary={team.name} />
              </MenuItem>
            ))}
          </Select>
    );
  }