export interface Team {
  name: string;
  nameToUse: string;
  teamId: string | number;
  id: string;
};

export interface ITeam {
  [id: string]: Team;
}