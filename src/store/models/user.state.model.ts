export interface UserState {
  isAuthenticated: boolean | null,
  roles: string[] | null,
  team: string | null,
  evidenceNumber: string | null,
};