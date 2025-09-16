// AuthService.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
}

export class AuthService {
  // Demo users for testing
  private static users: User[] = [
    {
      id: 1,
      name: 'Əliyev Cavid',
      email: 'cavid@q360.az',
      role: 'admin',
      department: 'İT Departamenti'
    },
    {
      id: 2,
      name: 'Məmmədova Leyla',
      email: 'leyla@q360.az',
      role: 'manager',
      department: 'İT Departamenti'
    },
    {
      id: 3,
      name: 'Həsənov Rəşad',
      email: 'rashad@q360.az',
      role: 'employee',
      department: 'İT Departamenti'
    }
  ];

  static login(email: string, password: string): User | null {
    // For demo purposes, we'll accept any password for our test users
    // In a real app, this would check against a database
    const user = this.users.find(u => u.email === email);
    
    if (user) {
      // Save user to localStorage to simulate session
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  }

  static logout(): void {
    localStorage.removeItem('currentUser');
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}