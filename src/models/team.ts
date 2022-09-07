export interface Team {
  name: string;
  nameToUse: string;
  teamId: number;
  id: string;
};

export interface ITeam {
  [id: string]: Team;
}