export type UserRoles = 'admin' | 'leader';

export interface User {
  uid: string;
  email: string;
};

export interface AuthUser {
  team?: string;
  role: UserRoles;
  name?: string;
  surname?: string;
  evidenceNumber?: string;
}