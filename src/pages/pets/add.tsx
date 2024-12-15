// src/pages/pets/add.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';

interface Disease {
  disease_id: number;
  disease_name: string;
}

export default function AddPetPage() {
  const [petName, setPetName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [neuterSpay, setNeuterSpay] = useState<boolean>(false);
  const [diseaseId, setDiseaseId] = useState<number | 'none'>('none'); // 初期値を 'none' に設定
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 追加: 登録中の状態を管理
  const router = useRouter();

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await apiClient.get<{ diseases: Disease[] }>('/diseases/');
        setDiseases(response.data.diseases);
        setIsLoading(false);
      } catch (err) {
        console.error('疾病リストの取得エラー:', err);
        setError('疾病リストの取得に失敗しました。');
        setIsLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 追加: 登録処理開始時に isSubmitting を true に設定
    setIsSubmitting(true);

    try {
      await apiClient.post('/pets/', {
        Pet_name: petName,
        Gender: gender,
        Birth_date: birthDate,
        Neuter_spay: neuterSpay,
        disease_id: diseaseId === 'none' ? null : diseaseId,
      });
      alert('ペットの登録に成功しました！');
      router.push('/'); // ホームページにリダイレクト
    } catch (error: unknown) { // エラーを unknown 型としてキャッチ
      console.error('ペット登録エラー:', error);
      if (axios.isAxiosError(error)) {
        // AxiosErrorの場合、responseデータに安全にアクセス
        const axiosErr = error as AxiosError<{ message?: string }>;
        if (axiosErr.response?.data?.message) {
          alert(`登録に失敗しました: ${axiosErr.response.data.message}`);
        } else {
          alert('登録に失敗しました。再度お試しください。');
        }
      } else {
        // AxiosError以外の予期しないエラー
        alert('登録に失敗しました。再度お試しください。');
      }
    } finally {
      // 追加: 登録処理終了後に isSubmitting を false にリセット
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        <style jsx>{`
          .loader {
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

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
          <label className="block mb-1 text-black">持病</label>
          <select
            value={diseaseId}
            onChange={(e) => setDiseaseId(e.target.value === 'none' ? 'none' : Number(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="none">持病無し</option>
            {diseases.map((disease) => (
              <option key={disease.disease_id} value={disease.disease_id}>
                {disease.disease_name}
              </option>
            ))}
          </select>
        </div>

        {/* 追加: 登録ボタン */}
        <button
          type="submit"
          className={`w-full px-3 py-2 text-white rounded ${
            isSubmitting ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={isSubmitting} // 追加: ボタンを無効化
        >
          {isSubmitting ? '登録中...' : '登録'} {/* 追加: テキストの変更 */}
        </button>
      </form>
    </div>
  );
}
