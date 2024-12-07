// src/components/Header.tsx
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600">
      <Link href="/" className="text-xl font-bold text-white">
        0thOpinion
      </Link>
      <nav>
        {user ? (
          <>
            <Link href="/pets/" className="px-3 text-white">
              ペット一覧
            </Link>
            <button onClick={logout} className="px-3 text-white">
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-3 text-white">
              ログイン
            </Link>
            <Link href="/register" className="px-3 text-white">
              ユーザー登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
