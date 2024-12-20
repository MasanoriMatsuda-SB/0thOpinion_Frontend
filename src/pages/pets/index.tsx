// src/pages/pets/index.tsx
'use client';

import { useEffect, useState, useContext, ChangeEvent } from 'react';
import apiClient from '../../lib/apiClient';
import { AuthContext } from '../../context/AuthContext';
import axios, { AxiosError } from 'axios';

interface Pet {
  Pet_id: number;
  Pet_name: string;
  Gender: string;
  Birth_date: string;
  Neuter_Spay: boolean;
  disease_id: number | null; // 念のためnull許容
  Image?: string | null; 
}

interface Disease {
  disease_id: number;
  disease_name: string;
}

export default function PetListPage() {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState<Pet[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [diseaseMap, setDiseaseMap] = useState<{ [key: number]: string }>({}); // disease_id -> disease_nameマッピング

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 削除中のペットIDを管理するステート
  const [deletingPetIds, setDeletingPetIds] = useState<Set<number>>(new Set());

  // 画像アップロード用のステート
  const [uploadingImagePetId, setUploadingImagePetId] = useState<number | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false); // アップロード中かどうか

  // ペット一覧取得
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await apiClient.get('/pets/');
        setPets(response.data.pets);
      } catch (err: unknown) {
        console.error('ペット一覧取得エラー:', err);
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError;
          const data = axiosErr.response?.data as { message?: string };
          if (data?.message) {
            setError(`ペット一覧の取得に失敗しました: ${data.message}`);
          } else {
            setError('ペット一覧の取得に失敗しました。サーバーエラーが発生しています。');
          }
        } else {
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

  // 病気一覧取得用のuseEffect（ペット一覧取得後に呼び出し）
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await apiClient.get<{ diseases: Disease[] }>('/diseases/');
        setDiseases(response.data.diseases);
      } catch (err) {
        console.error('疾病リスト取得エラー:', err);
      }
    };

    fetchDiseases();
  }, []);

  // diseasesが変化した時にマッピングを作成
  useEffect(() => {
    const map: { [key: number]: string } = {};
    for (const d of diseases) {
      map[d.disease_id] = d.disease_name;
    }
    setDiseaseMap(map);
  }, [diseases]);

  // ペットを削除する関数
  const handleDelete = async (petId: number) => {
    setDeletingPetIds(prev => new Set(prev).add(petId));

    try {
      await apiClient.delete(`/pets/${petId}`);
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
      setDeletingPetIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(petId);
        return newSet;
      });
    }
  };

  // 画像アップロードボタンが押されたとき
  const handleImageUploadClick = (petId: number) => {
    setUploadingImagePetId(petId);
    setSelectedImageFile(null);
  };

  // ファイル選択変更時
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0]);
    } else {
      setSelectedImageFile(null);
    }
  };

  // 画像アップロード処理
  const handleImageUpload = async (petId: number) => {
    if (!selectedImageFile) {
      alert('画像ファイルを選択してください。');
      return;
    }

    setIsImageUploading(true); // アップロード開始時
    const formData = new FormData();
    formData.append('Image', selectedImageFile);

    try {
      await apiClient.post(`/pets/${petId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('画像が登録されました！');
      const response = await apiClient.get('/pets/');
      setPets(response.data.pets);
      setUploadingImagePetId(null);
      setSelectedImageFile(null);
    } catch (err) {
      console.error('画像登録エラー:', err);
      alert('画像登録に失敗しました。再度お試しください。');
    } finally {
      setIsImageUploading(false); // アップロード終了時
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="pt-24 bg-white min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">ペット一覧</h1>
      {pets.length === 0 ? (
        <p>登録されたペットがありません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pets.map((pet) => {
            // disease_idから病名を取得
            const diseaseName = pet.disease_id && diseaseMap[pet.disease_id] ? diseaseMap[pet.disease_id] : '無し';

            return (
              <div key={pet.Pet_id} className="p-4 border rounded shadow flex flex-row">
                <div className="flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold">{pet.Pet_name}</h2>
                  <p>性別: {pet.Gender === 'M' ? 'オス' : 'メス'}</p>
                  <p>生年月日: {new Date(pet.Birth_date).toLocaleDateString()}</p>
                  <p>避妊・去勢済み: {pet.Neuter_Spay ? 'はい' : 'いいえ'}</p>
                  <p>持病: {diseaseName}</p> {/* 病気IDの代わりに病名表示 */}

                  {/* 削除ボタン */}
                  <button
                    type="button"
                    onClick={() => handleDelete(pet.Pet_id)}
                    disabled={deletingPetIds.has(pet.Pet_id)}
                    className={`mt-4 inline-block px-3 py-1 text-white rounded max-w-xs ${
                      deletingPetIds.has(pet.Pet_id)
                        ? 'bg-red-200 cursor-not-allowed'
                        : 'bg-red-400 hover:bg-red-500'
                    }`}
                  >
                    {deletingPetIds.has(pet.Pet_id) ? '削除中...' : '削除'}
                  </button>
                </div>

                <div className="ml-4 flex flex-col items-center justify-center w-48">
                  {pet.Image ? (
                    <img
                      src={`data:image/jpeg;base64,${pet.Image}`}
                      alt={`${pet.Pet_name}の画像`}
                      className="w-48 h-auto rounded"
                    />
                  ) : (
                    <>
                      {uploadingImagePetId === pet.Pet_id ? (
                        <div className="flex flex-col items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="mb-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageUpload(pet.Pet_id)}
                            className={`px-3 py-1 text-white rounded ${
                              isImageUploading
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            disabled={isImageUploading}
                          >
                            {isImageUploading ? 'アップロード中...' : 'アップロード'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadingImagePetId(null);
                              setSelectedImageFile(null);
                            }}
                            className="mt-2 text-sm text-gray-500"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleImageUploadClick(pet.Pet_id)}
                          className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          画像を登録
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
