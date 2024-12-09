// src/pages/register.tsx
'use client';

import { useState } from 'react';
import apiClient from '../lib/apiClient';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [screenName, setScreenName] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/users/register', {
        User_name: userName,
        Password: password,
        Screen_name: screenName,
        Sex: sex,
        Birth_date: birthDate,
        Address: address,
        Email: email,
      });
      alert('登録に成功しました！');
      router.push('/login'); // ログインページにリダイレクト
    } catch (error) {
      console.error('登録エラー:', error);
      alert('登録に失敗しました。');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded shadow-md w-full max-w-md">
        <h1 className="mb-4 text-2xl font-bold text-black">ユーザー登録</h1>

        {/* User_name */}
        <div className="mb-4">
          <label className="block mb-1 text-black">名前</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>

        {/* Screen_name */}
        <div className="mb-4">
          <label className="block mb-1 text-black">アカウント名</label>
          <input
            type="text"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 text-black">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>

        {/* Sex */}
        <div className="mb-4">
          <label className="block mb-1 text-black">性別</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as 'M' | 'F')}
            required
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="M">男</option>
            <option value="F">女</option>
          </select>
        </div>

        {/* Birth_date */}
        <div className="mb-4">
          <label className="block mb-1 text-black">生年月日</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block mb-1 text-black">住所</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-black">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="有効なメールアドレスを入力してください"
          />
        </div>

        <button type="submit" className="w-full px-3 py-2 text-white bg-green-500 rounded">
          登録
        </button>
      </form>
    </div>
  );
}
