import { generateId } from '@/lib/utils';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

const USERS_STORAGE_KEY = 'users';

export const getUsers = (): User[] => {
  try {
    console.log('[getUsers] Getting users from localStorage');
    const usersData = localStorage.getItem(USERS_STORAGE_KEY);
    if (!usersData) {
      console.log('[getUsers] No users found in localStorage');
      return [];
    }
    console.log('[getUsers] Raw data from localStorage:', usersData);
    const users = JSON.parse(usersData);
    console.log('[getUsers] Parsed users:', users);
    return users;
  } catch (error) {
    console.error('[getUsers] Error getting users:', error);
    return [];
  }
};

export const getUserById = (userId: string): User | null => {
  try {
    console.log('[getUserById] Looking for user with ID:', userId);
    const users = getUsers();
    const user = users.find(user => user.id === userId);
    console.log('[getUserById] Found user:', user);
    return user || null;
  } catch (error) {
    console.error('[getUserById] Error getting user:', error);
    return null;
  }
};

export const createUser = (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): User => {
  try {
    const users = getUsers();
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log('[createUser] Created new user:', newUser);
    return newUser;
  } catch (error) {
    console.error('[createUser] Error creating user:', error);
    throw error;
  }
};

export const updateUser = (userId: string, updates: Partial<User>): User => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log('[updateUser] Updated user:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('[updateUser] Error updating user:', error);
    throw error;
  }
};

export const deleteUser = (userId: string): void => {
  try {
    const users = getUsers();
    const updatedUsers = users.filter(user => user.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    console.log('[deleteUser] Deleted user:', userId);
  } catch (error) {
    console.error('[deleteUser] Error deleting user:', error);
    throw error;
  }
};
