import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('zulu_token');
        const userData = localStorage.getItem('zulu_user');
        
        if (token && userData) {
          // In a real app, you'd validate the token with your backend
          // For now, we'll just restore the user data
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('zulu_token');
        localStorage.removeItem('zulu_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call - in a real app, this would be a fetch to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in a real app, this would be handled by your backend
      if (email && password.length >= 6) {
        // Use email as consistent ID to maintain progress across sessions
        const userId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        // Check if user already exists in localStorage to maintain consistency
        const existingUserData = localStorage.getItem('zulu_user');
        let mockUser: User;
        
        if (existingUserData) {
          const existingUser = JSON.parse(existingUserData);
          // If same email, use existing user data to maintain consistency
          if (existingUser.email === email) {
            mockUser = existingUser;
          } else {
            // Different email, create new user
            mockUser = {
              id: userId,
              email,
              name: email.split('@')[0],
              createdAt: new Date().toISOString(),
            };
          }
        } else {
          // No existing user, create new one
          mockUser = {
            id: userId,
            email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString(),
          };
        }
        
        const mockToken = 'mock_jwt_token_' + userId; // Use userId instead of timestamp
        
        localStorage.setItem('zulu_token', mockToken);
        localStorage.setItem('zulu_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        console.log('🔐 User logged in:', email, 'ID:', userId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call - in a real app, this would be a fetch to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in a real app, this would be handled by your backend
      if (name && email && password.length >= 6) {
        // Use email as consistent ID to maintain progress across sessions
        const userId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        const mockUser: User = {
          id: userId,
          email,
          name,
          createdAt: new Date().toISOString(),
        };
        
        const mockToken = 'mock_jwt_token_' + userId; // Use userId instead of timestamp
        
        localStorage.setItem('zulu_token', mockToken);
        localStorage.setItem('zulu_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        console.log('📝 User registered:', email, 'ID:', userId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('zulu_token');
    localStorage.removeItem('zulu_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
