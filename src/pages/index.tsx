// src/pages/index.tsx
'use client';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image'; // Next.jsのImageコンポーネントをインポート

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 relative">
      {/* ヘッディング部分 */}
      <div className="flex flex-col items-center mb-6">
        <p className="text-3xl text-gray-700 mb-4">ペットのための予診・相談サービス</p>
        <h1 className="text-7xl text-gray-600 font-sans">
          0th Opinion - ゼロオピ
        </h1>
      </div>

      {user ? (
        <>
          <p className="mb-6 text-xl text-black">こんにちは、{user.screenName}さん</p>
          <div className="flex flex-col items-center space-y-4">
            {/* ペット登録ボタン */}
            <Link href="/pets/add" className="w-64 px-6 py-3 text-center text-white bg-green-500 rounded hover:bg-green-600">
              ペットを登録する
            </Link>

            {/* 症状を相談するボタン */}
            <Link href="/consultation" className="w-64 px-6 py-3 text-center text-white bg-red-400 rounded hover:bg-red-500">
              症状を相談する
            </Link>

            {/* 知恵袋（開発中）ボタン */}
            <Link href="/" className="w-64 px-6 py-3 text-center text-black bg-gray-400 rounded hover:bg-gray-500">
              知恵袋（開発中）
            </Link>

             {/* 健康辞典（開発中）ボタン */}
             <Link href="/" className="w-64 px-6 py-3 text-center text-black bg-gray-400 rounded hover:bg-gray-500">
              健康辞典（開発中）
            </Link>

          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col space-y-4">
            <Link href="/login" className="block w-64 px-10 py-3 text-center text-white bg-orange-300 rounded hover:bg-orange-400">
             ログイン
            </Link>
            <Link href="/register" className="block w-64 px-10 py-3 text-center text-white bg-green-400 rounded hover:bg-green-500">
            はじめての方
            </Link>
          </div>
        </>
      )}

      {/* 右下のロゴ */}
      <div className="fixed bottom-4 right-4">
        <Image
          src="/Nishitetsu_logo_vector.png"
          alt="Nishitetsu Logo"
          width={150} // 必要に応じてサイズ調整
          height={50} // 必要に応じてサイズ調整
          className="opacity-75 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
