import { account } from '../../appwrite';
import { ID } from 'appwrite';

export interface User {
  $id: string;
  email: string;
  name: string;
}

class AuthService {
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const response = await account.create(
        {
          userId: ID.unique(),
          email,
          password,
          name
        }
      );
      
      await this.login(email, password);
      
      return {
        $id: response.$id,
        email: response.email,
        name: response.name
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      await account.createEmailPasswordSession({ email, password });
      const user = await account.get();
      
      return {
        $id: user.$id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await account.deleteSession({ sessionId: 'current' });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return {
        $id: user.$id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();