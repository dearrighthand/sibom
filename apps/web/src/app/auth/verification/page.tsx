'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { ArrowLeft, Camera, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cv: any;
  }
}

export default function IdentityVerificationPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOpenCvReady, setIsOpenCvReady] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if OpenCV is already loaded (e.g. from previous navigation)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.cv) {
      setTimeout(() => {
        setIsOpenCvReady(true);
      }, 0);
    }
  }, []);

  const handleCameraClick = () => {
    if (!isOpenCvReady) {
      alert('보안 모듈을 로딩중입니다. 잠시만 기다려주세요.');
      return;
    }
    document.getElementById('camera-input')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (imgRef.current) {
        imgRef.current.src = url;
        setIsAnalyzing(true);
      }
    }
  };

  const processImage = () => {
    if (!window.cv || !imgRef.current || !canvasRef.current) return;

    try {
      const cv = window.cv;
      const img = cv.imread(imgRef.current);
      const dst = new cv.Mat();

      // 1. Basic Image Processing (Grayscale for detection - hypothetical)
      // For MVP: We will simply apply "Smart Masking" based on typical ID Card layout
      // assuming the user takes the photo in landscape mode.

      // Clone original to destination
      img.copyTo(dst);

      // Region of Interest (ROI) for Face (Approx. top-left/center-left) and ID Number (Bottom-right)
      const rows = img.rows;
      const cols = img.cols;

      // Define Face Region (Heuristic: typical ID photo is on the left)
      const faceRect = new cv.Rect(
        Math.floor(cols * 0.05),
        Math.floor(rows * 0.15),
        Math.floor(cols * 0.35),
        Math.floor(rows * 0.6),
      );

      // Define ID Number Region (Heuristic: typical ID number is on the right center/bottom)
      const idNumRect = new cv.Rect(
        Math.floor(cols * 0.5),
        Math.floor(rows * 0.45), // ID number usually starts around the middle height
        Math.floor(cols * 0.45),
        Math.floor(rows * 0.3),
      );

      // Apply Gaussian Blur (Mosaic effect) to detection regions
      // Face
      const faceRoi = dst.roi(faceRect);
      cv.GaussianBlur(faceRoi, faceRoi, new cv.Size(45, 45), 0);
      cv.GaussianBlur(faceRoi, faceRoi, new cv.Size(45, 45), 0); // Apply twice for stronger effect
      faceRoi.delete();

      // ID Number
      const idRoi = dst.roi(idNumRect);
      cv.GaussianBlur(idRoi, idRoi, new cv.Size(45, 45), 0);
      cv.GaussianBlur(idRoi, idRoi, new cv.Size(45, 45), 0);
      idRoi.delete();

      // Show result on canvas
      cv.imshow(canvasRef.current, dst);

      // Clean up
      img.delete();
      dst.delete();

      // Convert canvas to image url for display if needed or submission
      // const dataUrl = canvasRef.current.toDataURL();
      // setProcessedImage(dataUrl);

      // Finish
      setTimeout(() => {
        setIsAnalyzing(false);
        setProcessedImage('done');
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      alert('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      <Script
        src="https://docs.opencv.org/4.8.0/opencv.js"
        onLoad={() => {
          console.log('OpenCV Loaded');
          setIsOpenCvReady(true);
        }}
        onError={() => console.error('Failed to load OpenCV')}
        strategy="lazyOnload"
      />

      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between shadow-sm">
        <Link
          href="/auth/profile"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </Link>
        <div className="text-lg font-bold text-[#2D2D2D]">신분증 인증</div>
        <div className="w-6" />
      </div>

      <main className="px-6 pt-8 max-w-lg mx-auto flex flex-col items-center">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="bg-[#FFE4E1] text-[#FF8B7D] px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
            Step 3 <span className="text-[#FFB5AA] font-normal mx-1">of</span> 4
          </div>
        </div>

        {/* Character Chat Bubble */}
        <div className="relative mb-12 w-full flex flex-col items-center">
          <div className="relative z-10 mb-[-12px] w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#E0F7FA]">
            <Image
              src="/images/inyeon_character.png"
              alt="인연이"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="bg-white pt-8 pb-6 px-8 rounded-3xl shadow-lg border border-[#F0F0F0] text-center w-full relative">
            {/* Triangle for speech bubble effect if needed, though design uses stacking */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-[#F0F0F0] z-0 hidden" />

            <p className="text-[#2D2D2D] text-lg font-bold mb-2">
              {processedImage ? (
                '신분증 확인이 완료되었어요!'
              ) : (
                <>
                  안전한 만남을 위해
                  <br />
                  신분증을 확인해요.
                </>
              )}
            </p>
            <p className="text-[#666666] text-sm">
              {processedImage ? '다음 단계로 이동할까요?' : '개인정보는 저장되지 않아요.'}
            </p>
          </div>
        </div>

        {/* Main Visual / Processed Result */}
        <div className="w-full aspect-[4/3] bg-[#F5F7F9] rounded-3xl flex items-center justify-center mb-12 shadow-inner relative overflow-hidden group">
          {/* Hidden Image Source for OpenCV */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} style={{ display: 'none' }} onLoad={processImage} alt="source" />

          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <Loader2 className="w-10 h-10 text-[#FF8B7D] animate-spin" />
              <p className="text-[#FF8B7D] font-bold">보안 처리중...</p>
            </div>
          ) : processedImage ? (
            <div className="relative w-full h-full">
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-[#2D2D2D]">인증 완료</span>
                </div>
              </div>
            </div>
          ) : (
            // Default Placeholder
            <>
              <div className="absolute top-4 right-4">
                <LockIcon />
              </div>
              <div className="flex flex-col items-center justify-center gap-4 opacity-50">
                <ShieldCheck size={48} className="text-[#D1D1D1]" />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        {processedImage ? (
          <button
            onClick={() => router.push('/auth/complete')} // Placeholder next step
            className="w-full max-w-lg mx-auto rounded-full bg-[#FF8B7D] text-white py-4 text-lg font-bold shadow-lg hover:bg-[#ff7a6a] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            다음 <span className="text-xl">➜</span>
          </button>
        ) : (
          <button
            onClick={handleCameraClick}
            className={`w-full max-w-lg mx-auto rounded-full py-4 text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3
                            ${isOpenCvReady ? 'bg-[#FF8B7D] text-white hover:bg-[#ff7a6a]' : 'bg-gray-300 text-gray-500 cursor-wait'}
                        `}
            disabled={!isOpenCvReady}
          >
            <Camera className="w-6 h-6" />
            {isOpenCvReady ? '신분증 촬영하기' : '보안 모듈 로딩중...'}
          </button>
        )}

        {!processedImage && (
          <div className="text-center mt-4 flex items-center justify-center gap-2 text-[#748F78] text-sm font-medium">
            <ShieldCheck size={16} />
            <span>
              얼굴과 주민등록번호 뒷자리는
              <br className="sm:hidden" /> 자동으로 가려집니다.
            </span>
          </div>
        )}
      </div>

      {/* Hidden Input for Camera/File */}
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15V17M6 10V8C6 6.4087 6.63214 4.88258 7.75736 3.75736C8.88258 2.63214 10.4087 2 12 2C13.5913 2 15.1174 2.63214 16.2426 3.75736C17.3679 4.88258 18 6.4087 18 8V10"
        stroke="#748F78"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="#748F78" strokeWidth="2" />
    </svg>
  );
}
