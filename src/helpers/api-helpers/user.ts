import axios from 'axios-income';
import { IUser } from 'models/users.models';

export const fetchUsers = async (): Promise<Record<string, IUser>> => {
  const response = await axios.get<Record<string, IUser>>('/users.json');
  return response.data;
};

export const createUser = async (data: Record<string, IUser>) => {
  const { data: response } = await axios.patch('/users.json', data);
  return response.data;
};

export const updateUser = async (data: any) => {
  const { data: response } = await axios.patch(`/users/${data.id}.json`, { [data.field]: data.value });
  return response.data;
};

export const deleteUser = async (evidenceNumber: string) => {
  await axios.delete(`/users/${evidenceNumber}.json`);
};