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
          <label className="block mb-1 text-black">都道府県</label>
          <select
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          >
          <option value="">選択してください</option>
          <option value="北海道">北海道</option>
          <option value="青森県">青森県</option>
          <option value="岩手県">岩手県</option>
          <option value="宮城県">宮城県</option>
          <option value="秋田県">秋田県</option>
          <option value="山形県">山形県</option>
          <option value="福島県">福島県</option>
          <option value="茨城県">茨城県</option>
          <option value="栃木県">栃木県</option>
          <option value="群馬県">群馬県</option>
          <option value="埼玉県">埼玉県</option>
          <option value="千葉県">千葉県</option>
          <option value="東京都">東京都</option>
          <option value="神奈川県">神奈川県</option>
          <option value="新潟県">新潟県</option>
          <option value="富山県">富山県</option>
          <option value="石川県">石川県</option>
          <option value="福井県">福井県</option>
          <option value="山梨県">山梨県</option>
          <option value="長野県">長野県</option>
          <option value="岐阜県">岐阜県</option>
          <option value="静岡県">静岡県</option>
          <option value="愛知県">愛知県</option>
          <option value="三重県">三重県</option>
          <option value="滋賀県">滋賀県</option>
          <option value="京都府">京都府</option>
          <option value="大阪府">大阪府</option>
          <option value="兵庫県">兵庫県</option>
          <option value="奈良県">奈良県</option>
          <option value="和歌山県">和歌山県</option>
          <option value="鳥取県">鳥取県</option>
          <option value="島根県">島根県</option>
          <option value="岡山県">岡山県</option>
          <option value="広島県">広島県</option>
          <option value="山口県">山口県</option>
          <option value="徳島県">徳島県</option>
          <option value="香川県">香川県</option>
          <option value="愛媛県">愛媛県</option>
          <option value="高知県">高知県</option>
          <option value="福岡県">福岡県</option>
          <option value="佐賀県">佐賀県</option>
          <option value="長崎県">長崎県</option>
          <option value="熊本県">熊本県</option>
          <option value="大分県">大分県</option>
          <option value="宮崎県">宮崎県</option>
          <option value="鹿児島県">鹿児島県</option>
          <option value="沖縄県">沖縄県</option>
          </select>
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
