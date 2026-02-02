'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Edit2, User } from 'lucide-react';
import { api } from '@/lib/api';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { HOBBY_CODES, HOBBY_MAPPING } from '@sibom/shared';
import { MEETING_TYPE_CODES } from '@/constants/meetingTypes';
import { useDialog } from '@/hooks/useDialog';

interface Profile {
  id: string;
  name: string;
  birthYear: number;
  location: string;
  bio: string;
  interests: string[];
  meetingType: string;
  images: string[];
}

export default function MyPage() {
  const router = useRouter();
  const { alert: openAlert } = useDialog(); // Alias to avoid conflict with window.alert if needed, though we shadow it
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [editBio, setEditBio] = useState('');
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [editMeetingType, setEditMeetingType] = useState('');
  
  // Basic info edit (Mock implementation for now, could be a modal)
  const [showBasicEdit, setShowBasicEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }
      const data = await api.get<Profile>(`/profiles/${userId}`);
      setProfile(data);
      setEditBio(data.bio || '');
      setEditInterests(data.interests || []);
      setEditMeetingType(data.meetingType || '');
      setEditName(data.name);
      setEditLocation(data.location);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const calculateAge = (birthYear: number) => {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear; // Korean age calculation usually adds 1, but standard age is preferred 
  };

  const handleSave = async () => {
    try {
      if (!profile) return;
      
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const updateData = {
        bio: editBio,
        interests: editInterests,
        meetingType: editMeetingType,
        name: editName,
        location: editLocation,
      };

      await api.patch(`/profiles/${userId}`, updateData);
      
      // Update local state
      setProfile({
        ...profile,
        ...updateData,
      });
      
      setIsEditing(false);
      setShowBasicEdit(false);
      
      await openAlert('저장 완료', '프로필이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      await openAlert('저장 실패', '프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const toggleInterest = (interestCode: string) => {
    if (editInterests.includes(interestCode)) {
      setEditInterests(editInterests.filter(i => i !== interestCode));
    } else {
      if (editInterests.length >= 5) {
        openAlert('관심사 선택 제한', '관심사는 최대 5개까지 선택 가능합니다.');
        return;
      }
      setEditInterests([...editInterests, interestCode]);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!profile) return <div className="flex h-screen items-center justify-center">프로필을 불러올 수 없습니다.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <TopNavigation />

      {/* Page Header (My Page specific) */}
      <header className="bg-white px-4 py-3 sticky top-14 z-10 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-900">내 프로필</h1>
        {isEditing ? (
          <button 
            onClick={handleSave}
            className="text-[#FF5F5F] font-bold text-base"
          >
            완료
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-gray-500 font-medium text-sm"
          >
            수정
          </button>
        )}
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white shadow-lg">
              {profile.images && profile.images[0] ? (
                <Image 
                  src={profile.images[0]} 
                  alt="Profile" 
                  width={120} 
                  height={120}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100">
              <Camera className="w-5 h-5 text-[#666666]" />
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-[#2D2D2D] leading-snug">기본 정보</h2>
            {isEditing && (
              <button 
                onClick={() => setShowBasicEdit(!showBasicEdit)}
                className="text-lg text-[#FF8B7D] font-medium flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                정보 수정
              </button>
            )}
          </div>
          
          {showBasicEdit && isEditing ? (
            <div className="space-y-4 mb-4 border-b border-gray-100 pb-4">
              <div>
                <label className="block text-lg font-bold text-[#2D2D2D] mb-2">이름</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg text-[#2D2D2D] focus:border-[#FF8B7D] outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-[#2D2D2D] mb-2">지역</label>
                <input 
                  type="text" 
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg text-[#2D2D2D] focus:border-[#FF8B7D] outline-none"
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-lg text-[#666666]">이름</span>
              <span className="text-lg font-bold text-[#2D2D2D]">{profile.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-lg text-[#666666]">나이</span>
              <span className="text-lg font-bold text-[#2D2D2D]">{calculateAge(profile.birthYear)}세</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg text-[#666666]">지역</span>
              <span className="text-lg font-bold text-[#2D2D2D]">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 leading-snug">자기소개</h2>
          {isEditing ? (
            <textarea
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl resize-none text-lg text-[#2D2D2D] focus:border-[#FF8B7D] outline-none leading-relaxed"
              placeholder="자신에 대해 자유롭게 소개해 보세요."
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
            />
          ) : (
            <p className="text-lg text-[#2D2D2D] leading-relaxed whitespace-pre-wrap">
              {profile.bio || '자기소개를 입력해주세요.'}
            </p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 leading-snug">관심사</h2>
          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              HOBBY_CODES.map((hobby) => (
                <button
                  key={hobby.code}
                  onClick={() => toggleInterest(hobby.code)}
                  className={`px-5 py-3 rounded-full text-base font-bold transition-all active:scale-95 ${
                    editInterests.includes(hobby.code)
                      ? 'bg-[#FF8B7D] text-white shadow-md'
                      : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                  }`}
                >
                  {hobby.label}
                </button>
              ))
            ) : (
              profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interestCode) => (
                  <span
                    key={interestCode}
                    className="px-5 py-3 rounded-full bg-[#FFF0EF] text-[#FF8B7D] text-base font-bold flex items-center shadow-sm"
                  >
                    {HOBBY_MAPPING[interestCode] || interestCode}
                  </span>
                ))
              ) : (
                <span className="text-lg text-[#999999]">등록된 관심사가 없습니다.</span>
              )
            )}
          </div>
        </div>

        {/* Meeting Type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 leading-snug">원하는 만남</h2>
          <div className="space-y-3">
            {isEditing ? (
              MEETING_TYPE_CODES.map((type) => (
                <label
                  key={type.code}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm active:scale-98 ${
                    editMeetingType === type.code
                      ? 'border-[#FF8B7D] bg-[#FFF0EF]'
                      : 'border-gray-100 hover:border-[#FF8B7D]/30'
                  }`}
                >
                  <span className={`text-lg font-bold ${
                    editMeetingType === type.code ? 'text-[#2D2D2D]' : 'text-[#666666]'
                  }`}>
                    {type.label}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                       editMeetingType === type.code ? 'border-[#FF8B7D] bg-[#FF8B7D]' : 'border-gray-300 bg-white'
                  }`}>
                      {editMeetingType === type.code && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                   <input
                    type="radio"
                    name="meetingType"
                    value={type.code}
                    checked={editMeetingType === type.code}
                    onChange={(e) => setEditMeetingType(e.target.value)}
                    className="hidden" 
                  />
                  {/* Hidden input, custom visual above */}
                </label>
              ))
            ) : (
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center">
                <span className="text-lg font-bold text-[#2D2D2D]">
                  {MEETING_TYPE_CODES.find(o => o.code === profile.meetingType)?.label || '미지정'}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterNavigation />
    </div>
  );
}
