export enum UserRoles {
  Admin = 'admin',

}

export interface IUser {
  team?: string;
  roles: string[];
  name?: string;
  surname?: string;
  password?: string;
}