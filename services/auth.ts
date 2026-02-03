
import { User } from '../types';

const API_URL = "http://localhost:4477/api";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error("Error fetching users");
    return await response.json();
  } catch (error) {
    console.error("Error en getUsers:", error);
    return [];
  }
};

export const authenticate = async (email: string, pass: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error en authenticate:", error);
    return null;
  }
};

// Estos métodos ahora llaman al backend
export const addUser = async (newUser: User & { password: string }) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    if (!response.ok) throw new Error("Error adding user");
  } catch (error) {
    console.error("Error en addUser:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error("Error deleting user");
  } catch (error) {
    console.error("Error en deleteUser:", error);
    throw error;
  }
};

export const updateUserRole = async (id: string, newRole: 'ADMIN' | 'USER') => {
  try {
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    if (!response.ok) throw new Error("Error updating user role");
  } catch (error) {
    console.error("Error en updateUserRole:", error);
    throw error;
  }
};
