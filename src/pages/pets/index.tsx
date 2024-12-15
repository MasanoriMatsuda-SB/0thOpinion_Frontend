// src/pages/pets/index.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import apiClient from '../../lib/apiClient';
import { AuthContext } from '../../context/AuthContext';
import axios, { AxiosError } from 'axios';

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

  // 削除中のペットIDを管理するステート
  const [deletingPetIds, setDeletingPetIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await apiClient.get('/pets/');
        setPets(response.data.pets);
      } catch (err: unknown) {
        console.error('ペット一覧取得エラー:', err);
        if (axios.isAxiosError(err)) {
          // AxiosErrorの場合
          const axiosErr = err as AxiosError;
          const data = axiosErr.response?.data as { message?: string };
          if (data?.message) {
            setError(`ペット一覧の取得に失敗しました: ${data.message}`);
          } else {
            setError('ペット一覧の取得に失敗しました。サーバーエラーが発生しています。');
          }
        } else {
          // 予期しないエラー
          setError('ペット一覧の取得に失敗しました。');
        }
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

  // ペットを削除する関数
  const handleDelete = async (petId: number) => {
    // 削除中のペットIDを追加
    setDeletingPetIds(prev => new Set(prev).add(petId));

    try {
      await apiClient.delete(`/pets/${petId}`); // DELETEリクエストを送信
      // ペットリストから削除したペットを除外
      setPets(prevPets => prevPets.filter(pet => pet.Pet_id !== petId));
      alert('ペットが削除されました。');
    } catch (err: unknown) {
      console.error(`ペット削除エラー (ID: ${petId}):`, err);
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        const data = axiosErr.response?.data as { message?: string };
        if (data?.message) {
          alert(`削除に失敗しました: ${data.message}`);
        } else {
          alert('削除に失敗しました。サーバーエラーが発生しています。');
        }
      } else {
        alert('削除に失敗しました。再度お試しください。');
      }
    } finally {
      // 削除処理が完了したペットIDを削除
      setDeletingPetIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(petId);
        return newSet;
      });
    }
  };

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
            <div key={pet.Pet_id} className="p-4 border rounded shadow flex flex-col">
              <h2 className="text-xl font-semibold">{pet.Pet_name}</h2>
              <p>性別: {pet.Gender === 'M' ? 'オス' : 'メス'}</p>
              <p>生年月日: {new Date(pet.Birth_date).toLocaleDateString()}</p>
              <p>避妊・去勢済み: {pet.Neuter_Spay ? 'はい' : 'いいえ'}</p>
              <p>病気ID: {pet.disease_id}</p>
              
              {/* 削除ボタン */}
              <button
                type="button"
                onClick={() => handleDelete(pet.Pet_id)}
                disabled={deletingPetIds.has(pet.Pet_id)}
                className={`mt-4 px-3 py-1 text-white rounded ${
                  deletingPetIds.has(pet.Pet_id)
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {deletingPetIds.has(pet.Pet_id) ? '削除中...' : '削除'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
