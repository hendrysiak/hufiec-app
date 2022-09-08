export interface UserState {
  isAuthenticated: boolean | null,
  roles: string[] | null,
  team: number | null,
  evidenceNumber: string | null,
};