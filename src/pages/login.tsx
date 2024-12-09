// src/pages/login.tsx
'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert('ログインに成功しました！');
      router.push('/'); // ホームページにリダイレクト
    } catch (error: unknown) {
      console.error('ログインエラー:', error);
      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError;
        const data = axiosErr.response?.data as { message?: string };
        if (data?.message) {
          alert(`ログインに失敗しました: ${data.message}`);
        } else {
          alert('ログインに失敗しました。サーバーエラーが発生しています。');
        }
      } else {
        alert('ログインに失敗しました。再度お試しください。');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold">ログイン</h1>
        <div className="mb-4">
          <label className="block mb-1">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded">
          ログイン
        </button>
      </form>
    </div>
  );
}
