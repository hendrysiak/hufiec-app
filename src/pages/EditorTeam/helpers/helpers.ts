import { deleteTeamMember, permanentDeleteTeamMember } from 'helpers/editing-db.handler';

import { APIPerson } from 'models/registry.models';
import { countingMemberFee } from 'pages/Team/helpers/member-fee.helper';

import { IPerson } from '../EditorTeam';


export const handleDelete = async (rows: IPerson[], id: string, isAdmin?: boolean): Promise<void> => {
  if (!rows) return;

  const memberToDelete = rows.filter((el: IPerson) => el.id === id)[0];
  if (!window.confirm(`Jesteś pewien, że chcesz usunąć osobę: ${memberToDelete.name} ${memberToDelete.surname}`)) return;

  memberToDelete.dateOfDelete = new Date();
  if ((memberToDelete.feeState && memberToDelete.feeState < 0) || isAdmin) {
    try {
      await deleteTeamMember(memberToDelete);
      alert(`Udało się pomyślnie dodać do usunięcia ${memberToDelete.name} ${memberToDelete.surname}`);
    } catch {
      alert('Błąd, nie udało się usunąć');
    }
    return;
  } 

  try {
    await permanentDeleteTeamMember(memberToDelete);
    alert(`Udało się pomysślnie usunąć ${memberToDelete.name} ${memberToDelete.surname}`);
  }
  catch {
    alert('Błąd, nie udało się usunąć');
  }     
};

export const filterMembers = (usedRegistry: APIPerson[], name: string, surname: string) => {
  return usedRegistry.filter(member => 
    member.name?.toLocaleLowerCase().includes(name.toLocaleLowerCase()) && 
    member.surname?.toLocaleLowerCase().includes(surname.toLocaleLowerCase()))
    .map((member, index) => {
      return (
        {
          lp: index + 1,
          ...member,
          feeState: countingMemberFee(member)
        }
      );
    });
};

export const controlerDate = (value: Date, newData: Partial<APIPerson> | null, row: IPerson, nameKey: string) => {

  const minDate = newData?.dateOfAdd ? newData.dateOfAdd : row.dateOfAdd;
  const maxDate = newData?.dateOfDelete ? newData.dateOfDelete : row.dateOfDelete;
  
  if (maxDate && nameKey === 'dateOfAdd') {
    if (value.getTime() > new Date(maxDate).getTime()) {
      return true;
    }
  }
  
  if (minDate && nameKey === 'dateOfDelete') {
    if (new Date(minDate).getTime() > value.getTime()) {
      return true;
    }
  }

  return false;
};

export const checkIfTeamHasMembers = () => {};
