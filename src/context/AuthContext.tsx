// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient';

interface User {
  email: string;
  screenName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/users/login', {
        Email: email,
        Password: password,
      });
      const token = response.data.access_token;
      const screenName = response.data.screen_name;

      // トークンを localStorage に保存
      localStorage.setItem('token', token);

      // Axiosのデフォルトヘッダーにトークンを設定
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // ユーザー情報を設定
      setUser({ email, screenName });
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    }
  };

  const logout = () => {
    // localStorageからトークンを削除
    localStorage.removeItem('token');

    // Axiosのデフォルトヘッダーからトークンを削除
    delete apiClient.defaults.headers.common['Authorization'];

    // ユーザー情報をリセット
    setUser(null);
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Axiosのデフォルトヘッダーにトークンを設定
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // バックエンドからユーザー情報を取得（例: /users/me エンドポイント）
          const response = await apiClient.get('/users/me');
          setUser({
            email: response.data.email,
            screenName: response.data.screen_name,
          });
        } catch (error) {
          console.error('ユーザー情報取得エラー:', error);
          logout();
        }
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
