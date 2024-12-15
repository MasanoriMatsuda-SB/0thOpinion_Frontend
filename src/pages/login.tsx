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

  // isSubmitting ステートを追加
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ログイン処理開始
    setIsSubmitting(true);

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
    } finally {
      // ログイン処理終了
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="mb-4 text-2xl font-bold text-center">ログイン</h1>
        
        {/* メールアドレス */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-gray-700">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="例: user@example.com"
          />
        </div>

        {/* パスワード */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-gray-700">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="パスワード"
          />
        </div>

        {/* ログインボタン */}
        <button
          type="submit"
          className={`w-full px-3 py-2 text-white rounded ${
            isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
