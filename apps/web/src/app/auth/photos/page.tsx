'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Image as ImageIcon, Camera, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRegistrationStore } from '../../../stores/useRegistrationStore';
import { api } from '@/lib/api';

export default function PhotoPage() {
  const router = useRouter();
  const { profileImage, setProfileImage } = useRegistrationStore();
  const [preview, setPreview] = useState<string | null>(profileImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const  data = await api.post<{ url: string }>('/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setProfileImage(data.url); // Save URL to store
      } catch (error) {
        console.error('Upload Error:', error);
        alert('사진 업로드 중 오류가 발생했습니다.');
        setPreview(null); // Reset preview on error
      } finally {
        setIsUploading(false);
      }
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  const triggerCamera = () => cameraInputRef.current?.click();

  const handleSubmit = () => {
    // Complete registration logic would go here
    // For now, maybe go to a "Completion" page or Home
    console.log('Photo Saved');
    router.push('/auth/complete');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between shadow-sm">
        <Link
          href="/auth/meeting-type"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </Link>
        <div className="text-lg font-bold text-[#2D2D2D]">프로필 사진 등록</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#FF8B7D]"></div>
        </div>
      </div>

      <main className="px-6 pt-8 max-w-lg mx-auto flex flex-col items-center">
        {/* Avatar & Bubble */}
        <div className="flex flex-col items-center gap-4 mb-8 w-full">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#E0F7FA]">
            <Image
              src="/images/inyeon_character.png"
              alt="인연이 UI"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>

          <div className="bg-white px-6 py-5 rounded-3xl shadow-sm border border-[#F0F0F0] relative w-full text-center">
            {/* Triangle tick */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-white"></div>
            <p className="text-[#2D2D2D] text-lg font-medium leading-relaxed">
              &quot;본인의 최근 사진을 올려주세요.
              <br />
              <span className="font-bold text-[#FF8B7D]">얼굴이 잘 보이는</span> 사진이 좋아요!&quot;
            </p>
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="flex flex-col gap-4 w-full mb-8">
          <button
            onClick={triggerFileSelect}
            className="w-full bg-[#FF8B7D] text-white py-5 rounded-full text-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-[#FF7B6D]"
          >
            <ImageIcon className="w-6 h-6" />
            사진 선택하기
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={triggerCamera}
            className="w-full bg-[#7D9D85] text-white py-5 rounded-full text-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-[#6D8D75]"
          >
            <Camera className="w-6 h-6" />
            사진 촬영하기
          </button>
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="user"
            className="hidden"
          />
        </div>

        {/* Preview Area */}
        <div className="w-full">
          <div className="text-gray-500 mb-2 font-medium">미리보기</div>
          <div className="w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden relative">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className={`object-cover ${isUploading ? 'opacity-50' : ''}`}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-300">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-[#FF8B7D] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span>업로드 중...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-lg">사진이 여기에 표시됩니다</span>
                  </>
                )}
              </div>
            )}
          </div>
          {preview && (
            <div className="mt-4 p-4 bg-[#F9FAFB] rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF8B7D] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#4B5563]">
                <span className="font-bold text-[#2D2D2D]">AI가 얼굴을 확인하고</span>
                <br />
                부적절한 사진은 제한될 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Fixed Next Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handleSubmit}
          disabled={!preview || isUploading}
          className={`w-full max-w-lg mx-auto rounded-full py-4 text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                         ${
                           preview && !isUploading
                             ? 'bg-[#FF8B7D] text-white hover:bg-[#ff7a6a] shadow-[0_10px_25px_-5px_rgba(255,139,125,0.4)]'
                             : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                         }
                     `}
        >
          다음 <span className="text-xl">➜</span>
        </button>
      </div>
    </div>
  );
}
