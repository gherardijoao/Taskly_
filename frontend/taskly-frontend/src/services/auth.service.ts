interface LoginResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

class AuthService {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  private tokenKey = 'taskly_token';
  private userKey = 'taskly_user';

  async login(email: string, senha: string): Promise<boolean> {
    try {
      console.log('Tentando login com:', { email, senha });
      console.log('URL da API:', this.apiUrl);
      
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        console.error('Erro na resposta:', response.status);
        const errorData = await response.json();
        console.error('Detalhes do erro:', errorData);
        throw new Error(errorData.error || 'Credenciais inválidas');
      }

      const data = await response.json();
      console.log('Resposta do login:', data);
      
      this.setToken(data.token);
      
      // Se a API retornar dados do usuário, salve-os
      if (data.user) {
        this.setUser({
          id: data.user.id,
          nome: data.user.nome,
          email: data.user.email
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): { id: string; nome: string; email: string } | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getUserName(): string {
    const user = this.getUser();
    return user ? user.nome : '';
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: { id: string; nome: string; email: string }): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}

export const authService = new AuthService(); 