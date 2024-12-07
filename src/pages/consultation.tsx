// src/pages/consultation.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../lib/apiClient';

interface Pet {
  Pet_id: number;
  Pet_name: string;
  Gender: string;
  Birth_date: string;
  Neuter_Spay: boolean;
  disease_id: number;
}

export default function ConsultationPage() {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | ''>('');
  const [symptom, setSymptom] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await apiClient.get('/pets/');
        setPets(res.data.pets);
      } catch (err: any) {
        console.error('ペット一覧取得エラー:', err);
        setError('ペット一覧の取得に失敗しました。');
      }
    };

    if (user) {
      fetchPets();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    if (selectedPetId === '') {
      setError('ペットを選択してください。');
      setLoading(false);
      return;
    }

    if (!symptom.trim()) {
      setError('症状の内容を入力してください。');
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post('/questions/', {
        Content: symptom,
        Pet_id: selectedPetId,
      });

      setResponse(res.data.AI_answer);
    } catch (err: any) {
      console.error('症状相談エラー:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`相談に失敗しました: ${err.response.data.message}`);
      } else {
        setError('相談に失敗しました。再度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">ログインしてください。</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-black">症状の相談</h1>

        {/* ペット選択 */}
        <div className="mb-4">
          <label className="block mb-2 text-black">相談するペットを選択</label>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(Number(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="">-- ペットを選択 --</option>
            {pets.map((pet) => (
              <option key={pet.Pet_id} value={pet.Pet_id}>
                {pet.Pet_name} ({pet.Gender === 'M' ? 'オス' : 'メス'})
              </option>
            ))}
          </select>
        </div>

        {/* 症状入力 */}
        <div className="mb-4">
          <label className="block mb-2 text-black">症状の内容</label>
          <textarea
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
            rows={4}
            placeholder="例: 最近元気がなく、食欲が減退しています。"
          ></textarea>
        </div>

        {/* エラーメッセージ */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        {/* 送信ボタン */}
        <button
          type="submit"
          className={`w-full px-3 py-2 text-white rounded ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={loading}
        >
          {loading ? '相談中...' : '相談する'}
        </button>

        {/* AIからの回答 */}
        {response && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded">
            <h2 className="mb-2 text-xl font-semibold text-black">回答</h2>
            <p className="text-black whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </form>
    </div>
  );
}
