// src/pages/pets/add.tsx
'use client';

import { useState } from 'react';
import apiClient from '../../lib/apiClient';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';

export default function AddPetPage() {
  const [petName, setPetName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [neuterSpay, setNeuterSpay] = useState<boolean>(false);
  const [diseaseId, setDiseaseId] = useState<number | ''>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/pets/', {
        Pet_name: petName,
        Gender: gender,
        Birth_date: birthDate,
        Neuter_Spay: neuterSpay,
        disease_id: diseaseId,
      });
      alert('ペットの登録に成功しました！');
      router.push('/'); // ホームページにリダイレクト
    } catch (error: unknown) {
      console.error('ペット登録エラー:', error);
      if (axios.isAxiosError(error)) {
        // AxiosErrorの場合、responseデータに安全にアクセス
        const axiosErr = error as AxiosError;
        const data = axiosErr.response?.data as { message?: string };
        if (data?.message) {
          alert(`登録に失敗しました: ${data.message}`);
        } else {
          alert('登録に失敗しました。再度お試しください。');
        }
      } else {
        // AxiosError以外の予期しないエラー
        alert('登録に失敗しました。再度お試しください。');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-gray-100 rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-black">ペット登録</h1>

        {/* Pet_name */}
        <div className="mb-4">
          <label className="block mb-1 text-black">ペット名</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
            placeholder="例: ココ"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block mb-1 text-black">性別</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'M' | 'F')}
            required
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="M">オス</option>
            <option value="F">メス</option>
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

        {/* Neuter_Spay */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={neuterSpay}
            onChange={(e) => setNeuterSpay(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded"
            id="neuterSpay"
          />
          <label htmlFor="neuterSpay" className="ml-2 text-black">避妊・去勢済み</label>
        </div>

        {/* disease_id */}
        <div className="mb-4">
          <label className="block mb-1 text-black">病気ID</label>
          <input
            type="number"
            value={diseaseId}
            onChange={(e) => setDiseaseId(Number(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded text-black"
            placeholder="例: 1"
            min="1"
          />
        </div>

        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          登録
        </button>
      </form>
    </div>
  );
}
