// src/pages/consultation.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../lib/apiClient';
import axios from 'axios';

interface Pet {
  Pet_id: number;
  Pet_name: string;
  Gender: string;
  Birth_date: string;
  Neuter_Spay: boolean;
  disease_id: number;
}

interface Question {
  id: number;
  type: 'choice' | 'number' | 'text';
  question: string;
  options?: string[];
}

const questions: Question[] = [
  {
    id: 1,
    type: 'choice',
    question: 'どのカテゴリに該当しますか？',
    options: ['排泄物・嘔吐', '見た目の変異', '行動・動作・しぐさなど', '体重増加、減少'],
  },
  {
    id: 2,
    type: 'choice',
    question: '現在の元気の度合いについて教えてください',
    options: ['元気がある', '元気があまりない', 'ぐったりしている'],
  },
  {
    id: 3,
    type: 'choice',
    question: '現在の食欲について教えてください',
    options: ['食欲がある', '食欲があまりない', '食欲は全くない'],
  },
  {
    id: 4,
    type: 'choice',
    question: '症状はいつからですか？',
    options: ['今日', '1日前', '2日前', '3日前', '1週間以上前'],
  },
  {
    id: 5,
    type: 'text',
    question: '症状に関する詳細を記述してください',
  },
];

export default function ConsultationPage() {
  const { user } = useContext(AuthContext);

  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useState<{ id: number; question: string; answer: string }[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [wizardLoading, setWizardLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string>('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await apiClient.get('/pets/');
        setPets(res.data.pets);
      } catch (err: unknown) {
        console.error('ペット一覧取得エラー:', err);
        if (axios.isAxiosError(err)) {
          setError('ペット一覧の取得に失敗しました。サーバーエラーが発生しています。');
        } else {
          setError('ペット一覧の取得に失敗しました。');
        }
      }
    };

    if (user) {
      fetchPets();
    }
  }, [user]);

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!inputValue.trim() && currentQuestion.type !== 'choice') return;

    setResponses((prev) => [
      ...prev,
      { id: currentQuestion.id, question: currentQuestion.question, answer: inputValue },
    ]);

    setInputValue('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(questions.length); // 全質問完了
    }
  };

  const handleChoiceSelect = (option: string) => {
    setResponses((prev) => [
      ...prev,
      { id: questions[currentQuestionIndex].id, question: questions[currentQuestionIndex].question, answer: option },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(questions.length); // 全質問完了
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setResponses((prev) => prev.slice(0, -1)); // 最後の回答を削除
    }
  };

  const handleWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWizardLoading(true);
    setApiResponse('');
    setError(null);

    if (selectedPetId === '') {
      setError('ペットを選択してください。');
      setWizardLoading(false);
      return;
    }

    const contentText = responses
      .map((res) => `${res.question}: ${res.answer}`)
      .join('\n');

    console.log('送信データ:', {
      Pet_id: selectedPetId,
      Content: contentText,
    });

    try {
      const res = await apiClient.post('/questions/', {
        Pet_id: selectedPetId,
        Content: contentText,
      });
      setApiResponse(res.data.AI_answer);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('エラー詳細:', err.response?.data || err.message);
      } else {
        console.error('エラー詳細:', err instanceof Error ? err.message : String(err));
      }
      setError('相談に失敗しました。再度お試しください。');
    } finally {
      setWizardLoading(false);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">ログインしてください。</div>;
  }

  return (
    <div className="pt-24 flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-6 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-black">症状の相談</h1>

        {/* ペット選択 */}
        <div className="mb-4">
          <label className="block mb-2 text-black">相談するペットを選択</label>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(Number(e.target.value))}
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

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* ウィザード形式の質問 */}
        <div className="bg-[#BFDFFD82] p-4 rounded">
          {responses.map((res) => (
            <div key={res.id} className="mb-2">
              <div className="p-2 bg-white text-black rounded mb-1 text-left">
                <p className="font-semibold">{res.question}</p>
              </div>
              <div className="text-right">
                <p className="inline-block bg-blue-200 p-2 rounded text-black">{res.answer}</p>
              </div>
            </div>
          ))}

          {/* 現在の質問 */}
          {currentQuestionIndex < questions.length && (
            <div>
              <div className="p-2 bg-white text-black rounded mb-2 text-left">
                {questions[currentQuestionIndex].question}
              </div>
              {questions[currentQuestionIndex].type === 'choice' && (
                <div className="text-left">
                  {questions[currentQuestionIndex].options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="block w-full p-2 mb-2 text-left bg-blue-100 rounded hover:bg-blue-200"
                      onClick={() => handleChoiceSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              {questions[currentQuestionIndex].type === 'text' && (
                <div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    onClick={handleAnswerSubmit}
                    className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    決定
                  </button>
                </div>
              )}
              <button
                onClick={handlePreviousQuestion}
                className="mt-2 px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                前の質問に戻る
              </button>
            </div>
          )}

          {/* 全ての質問が完了した場合、相談送信ボタン表示 */}
          {currentQuestionIndex === questions.length && (
            <div>
              <form onSubmit={handleWizardSubmit}>
                <button
                  type="submit"
                  className="w-full px-4 py-2 mb-2 text-white bg-green-500 rounded hover:bg-green-600"
                  disabled={wizardLoading}
                >
                  {wizardLoading ? '相談中...' : '相談する'}
                </button>
              </form>
              <button
                onClick={handlePreviousQuestion}
                className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                前の質問に戻る
              </button>
            </div>
          )}
        </div>

        {/* AI回答表示 */}
        {apiResponse && (
          <div
            className="mt-6 p-4 bg-green-100 border border-green-300 rounded"
            style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', maxWidth: '100%' }}
          >
            <h2 className="mb-2 text-lg font-semibold text-black">AIからの回答</h2>
            <p className="text-black whitespace-pre-line">{apiResponse}</p>
          </div>
        )}

        {error && <div className="mt-4 text-red-500">{error}</div>}
      </div>
    </div>
  );
}
