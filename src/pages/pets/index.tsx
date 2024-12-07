// src/pages/pets/index.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import apiClient from '../../lib/apiClient';
import { AuthContext } from '../../context/AuthContext';

interface Pet {
  Pet_id: number;
  Pet_name: string;
  Gender: string;
  Birth_date: string;
  Neuter_Spay: boolean;
  disease_id: number;
}

export default function PetListPage() {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await apiClient.get('/pets/');
        setPets(response.data.pets);
      } catch (err: any) {
        console.error('ペット一覧取得エラー:', err);
        setError('ペット一覧の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPets();
    } else {
      setLoading(false);
      setError('ログインしてください。');
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">ペット一覧</h1>
      {pets.length === 0 ? (
        <p>登録されたペットがありません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pets.map((pet) => (
            <div key={pet.Pet_id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{pet.Pet_name}</h2>
              <p>性別: {pet.Gender === 'M' ? 'オス' : 'メス'}</p>
              <p>生年月日: {new Date(pet.Birth_date).toLocaleDateString()}</p>
              <p>避妊・去勢済み: {pet.Neuter_Spay ? 'はい' : 'いいえ'}</p>
              <p>病気ID: {pet.disease_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
