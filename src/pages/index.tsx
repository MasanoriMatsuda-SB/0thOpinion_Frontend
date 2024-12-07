// src/pages/index.tsx
'use client';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="mb-6 text-4xl font-bold text-black">0thOpinionへようこそ！</h1>
      {user ? (
        <>
          <p className="mb-6 text-xl text-black">こんにちは、{user.screenName}さん</p>
          <div className="flex flex-col items-center space-y-4">
            {/* ペット登録ボタン */}
            <Link href="/pets/add" className="w-64 px-6 py-3 text-center text-white bg-green-500 rounded hover:bg-green-600">
              ペットを登録する
            </Link>
            
            {/* 症状を相談するボタン */}
            <Link href="/consultation" className="w-64 px-6 py-3 text-center text-white bg-blue-500 rounded hover:bg-blue-600">
              症状を相談する
            </Link>

            {/* ログアウトボタン */}
            <button
              onClick={logout}
              className="w-64 px-6 py-3 text-center text-white bg-red-500 rounded hover:bg-red-600"
            >
              ログアウト
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex space-x-4">
            <Link href="/login" className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600">
              ログイン
            </Link>
            <Link href="/register" className="px-6 py-3 text-white bg-green-500 rounded hover:bg-green-600">
              ユーザー登録
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
