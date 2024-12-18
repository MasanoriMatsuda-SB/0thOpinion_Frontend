// src/components/Header.tsx
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Image from 'next/image';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-6 bg-white border-b border-black shadow-md h-24 z-50">
      {/* ロゴ画像 */}
      <Link href="/">
        <Image
          src="/ゼロオピロゴマーク.png" // public フォルダに画像を置いていると仮定
          alt="0thOpinion Logo"
          width={120} // ロゴサイズを調整
          height={120}
          className="cursor-pointer"
        />
      </Link>
      {/* ナビゲーション */}
      <nav className="flex items-center">
        {user ? (
          <>
            <Link href="/pets/" className="px-4 text-black font-semibold">
              ペット一覧
            </Link>
            <button
              onClick={logout}
              className="px-4 text-black font-semibold"
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-4 text-black font-semibold">
              ログイン
            </Link>
            <Link href="/register" className="px-4 text-black font-semibold">
              ユーザー登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
