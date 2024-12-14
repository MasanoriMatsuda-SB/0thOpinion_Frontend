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
        <Image
          src="/ゼロオピロゴマーク_2.png" // 公開ディレクトリ（/public）に保存された画像パス
          alt="0thOpinion Logo"
          width={900} // 必要に応じてサイズ調整
          height={300} // 必要に応じてサイズ調整
        />
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

      {/* 右下のロゴ */}
      <div className="fixed bottom-4 right-4">
        <Image
          src="/Nishitetsu_logo_vector.png"
          alt="Nishitetsu Logo"
          width={300} // 必要に応じてサイズ調整
          height={100} // 必要に応じてサイズ調整
          className="opacity-75 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
