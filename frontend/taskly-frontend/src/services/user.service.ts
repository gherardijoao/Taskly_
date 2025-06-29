import { httpService } from './http.service';

interface UserRegistrationData {
  nome: string;
  email: string;
  senha: string;
}

interface UserProfileData {
  id: string;
  nome: string;
  email: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

class UserService {
  async register(userData: UserRegistrationData): Promise<boolean> {
    try {
      await httpService.post('/users', userData);
      return true;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  async getProfile(): Promise<UserProfileData> {
    try {
      return await httpService.get<UserProfileData>('/profile');
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      throw error;
    }
  }

  async updateProfile(userData: Partial<UserRegistrationData>): Promise<UserProfileData> {
    try {
      return await httpService.put<UserProfileData>('/profile', userData);
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await httpService.delete('/profile');
    } catch (error) {
      console.error('Erro ao excluir conta de usuário:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 