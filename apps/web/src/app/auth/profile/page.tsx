'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BottomSheet } from '../../../components/BottomSheet';
import { DatePickerWheel } from '../../../components/DatePickerWheel';
import { useDialog } from '../../../hooks/useDialog';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegistrationStore } from '../../../stores/useRegistrationStore';
import { api } from '@/lib/api';

// Mock Data for Date
const CURRENT_YEAR = new Date().getFullYear();
const MAX_BIRTH_YEAR = CURRENT_YEAR - 50;
const YEARS = Array.from({ length: 80 }, (_, i) => MAX_BIRTH_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

interface LocationItem {
  code: string;
  name: string;
}

const profileSchema = z.object({
  name: z.string().min(2, '이름을 2글자 이상 입력해주세요.'),
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상 입력해주세요.'),
  birthYear: z.number({ message: '연도를 선택해주세요.' }).max(MAX_BIRTH_YEAR, `만 50세 이상만 가입 가능합니다.`),
  birthMonth: z.number({ message: '월을 선택해주세요.' }),
  birthDay: z.number({ message: '일을 선택해주세요.' }),
  gender: z.enum(['male', 'female'] as const, { message: '성별을 선택해주세요.' }),
  locMain: z.object({ code: z.string(), name: z.string() }, { message: '시/도를 선택해주세요.' }),
  locSub: z.object({ code: z.string(), name: z.string() }, { message: '시/군/구를 선택해주세요.' }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileCreationPage() {
  const {} = useDialog();
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [activeSheet, setActiveSheet] = useState<'date' | 'locMain' | 'locSub' | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    name,
    email,
    password,
    birthYear,
    birthMonth,
    birthDay,
    gender,
    locMain,
    locSub,
    setProfileData,
  } = useRegistrationStore();

  // Temp state for date picker
  const [tempDate, setTempDate] = useState<{
    year: number | null;
    month: number | null;
    day: number | null;
  }>({
    year: null,
    month: null,
    day: null,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: name || '',
      email: email || '',
      password: password || '',
      birthYear: birthYear || undefined,
      birthMonth: birthMonth || undefined,
      birthDay: birthDay || undefined,
      gender: gender || undefined,
      locMain: locMain || undefined,
      locSub: locSub || undefined,
    },
  });

  // Watch location change to fetch districts
  const selectedProvince = watch('locMain');

  // Fetch Provinces on Mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {

        const data = await api.get<LocationItem[]>('/locations/provinces');
        setProvinces(data);
      } catch (e) {
        console.error('Failed to fetch provinces', e);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Districts when Province changes
  useEffect(() => {
    if (selectedProvince?.code) {
      const fetchDistricts = async () => {
        try {

          const data = await api.get<LocationItem[]>(`/locations/districts?provinceCode=${selectedProvince.code}`);
          setDistricts(data);
        } catch (e) {
          console.error('Failed to fetch districts', e);
        }
      };
      fetchDistricts();
      // Only reset if it's different from store (prevent reset on initial load if store has value)
      if (selectedProvince.code !== locMain?.code) {
        setValue('locSub', null as unknown as ProfileFormData['locSub']);
      }
    } else {
      setDistricts([]);
    }
  }, [selectedProvince?.code, setValue, locMain]);

  const router = useRouter();

  const onSubmit = (data: ProfileFormData) => {
    console.log('Saving to store:', data);
    setProfileData(data);
    router.push('/auth/intro');
  };

  // Date Picker Logic
  const openDatePicker = () => {
    const currentValues = getValues();
    setTempDate({
      year: currentValues.birthYear || 1958,
      month: currentValues.birthMonth || 1,
      day: currentValues.birthDay || 1,
    });
    setActiveSheet('date');
  };

  const handleDateChange = (newDate: { year: number; month: number; day: number }) => {
    // Validation for days in month
    const daysInMonth = new Date(newDate.year, newDate.month, 0).getDate();
    const validDay = Math.min(newDate.day, daysInMonth);

    setTempDate({
      ...newDate,
      day: validDay,
    });
  };

  const confirmDate = () => {
    if (tempDate.year && tempDate.month && tempDate.day) {
      setValue('birthYear', tempDate.year, { shouldValidate: true });
      setValue('birthMonth', tempDate.month, { shouldValidate: true });
      setValue('birthDay', tempDate.day, { shouldValidate: true });
    }
    setActiveSheet(null);
  };

  // Calculate days for current temp month/year for the picker
  const currentDaysInPicker = new Date(tempDate.year || 1958, tempDate.month || 1, 0).getDate();
  const daysArray = Array.from({ length: currentDaysInPicker }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] font-sans pb-8">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 pb-4 flex items-center justify-between shadow-sm" style={{ paddingTop: 'calc(16px + var(--safe-area-inset-top, 0px))' }}>
        <Link
          href="/auth/phone"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </Link>
        <div className="text-lg font-bold text-[#2D2D2D]">프로필 생성</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#FF8B7D]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      <main className="px-6 pt-8 max-w-lg mx-auto flex flex-col">
        {/* Character Chat Bubble */}
        <div className="flex items-start gap-4 mb-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-[#E0F7FA]">
            <Image
              src="/images/inyeon_character.png"
              alt="인연이"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-[#F0F0F0]">
            <p className="text-[#2D2D2D] text-[15px] font-medium leading-relaxed">
              안녕하세요! 저는 인연이에요.
              <br />
              편안하게 하나씩 알려주세요 😊
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Question 1: Name */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-3">성함이 어떻게 되시나요?</h3>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="예: 김영철"
                  className={`w-full bg-[#F9F9F8] border rounded-xl px-5 py-4 text-lg text-[#2D2D2D] placeholder:text-[#999999] outline-none transition-colors 
                                         ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#EBEBE6] focus:border-[#FF8B7D] focus:bg-white'}`}
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm mt-2 ml-1">{errors.name.message}</p>}
          </section>

          {/* Question 1-2: Account Info */}
          <section className="mb-8 space-y-4">
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-3">계정 정보를 입력해주세요</h3>

            {/* Email */}
            <div>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="이메일 (예: sibom@example.com)"
                    className={`w-full bg-[#F9F9F8] border rounded-xl px-5 py-4 text-lg text-[#2D2D2D] placeholder:text-[#999999] outline-none transition-colors 
                                             ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#EBEBE6] focus:border-[#FF8B7D] focus:bg-white'}`}
                    onBlur={async (e) => {
                      field.onBlur(); // Validate format first
                      const email = e.target.value;
                      if (email && !errors.email) {
                        setIsCheckingEmail(true);
                        try {

                          const data = await api.post<{ exists: boolean }>('/auth/email/check', { email });
                          if (data.exists) {
                            setError('email', {
                              type: 'manual',
                              message: '이미 가입된 이메일입니다.',
                            });
                          } else {
                            clearErrors('email');
                          }
                        } catch (err) {
                          console.error('Email check failed', err);
                        } finally {
                          setIsCheckingEmail(false);
                        }
                      }
                    }}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="비밀번호 (6자 이상)"
                    className={`w-full bg-[#F9F9F8] border rounded-xl px-5 py-4 text-lg text-[#2D2D2D] placeholder:text-[#999999] outline-none transition-colors 
                                             ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#EBEBE6] focus:border-[#FF8B7D] focus:bg-white'}`}
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.password.message}</p>
              )}
            </div>
          </section>

          {/* Question 2: Birthdate */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-3">생년월일을 알려주세요</h3>
            <div className="flex gap-2">
              <Controller
                name="birthYear"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={openDatePicker}
                    className={`flex-1 flex items-center justify-between px-4 py-4 rounded-xl border bg-white ${field.value ? 'border-[#FF8B7D] text-[#2D2D2D]' : 'border-[#EBEBE6] text-[#999999]'}`}
                  >
                    <span className="text-lg font-medium">{field.value || '1958'}</span>
                    <span className="text-sm ml-1 text-[#666666]">년</span>
                  </button>
                )}
              />
              <Controller
                name="birthMonth"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={openDatePicker}
                    className={`flex-1 flex items-center justify-between px-4 py-4 rounded-xl border bg-white ${field.value ? 'border-[#FF8B7D] text-[#2D2D2D]' : 'border-[#EBEBE6] text-[#999999]'}`}
                  >
                    <span className="text-lg font-medium">{field.value || '5'}</span>
                    <span className="text-sm ml-1 text-[#666666]">월</span>
                  </button>
                )}
              />
              <Controller
                name="birthDay"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={openDatePicker}
                    className={`flex-1 flex items-center justify-between px-4 py-4 rounded-xl border bg-white ${field.value ? 'border-[#FF8B7D] text-[#2D2D2D]' : 'border-[#EBEBE6] text-[#999999]'}`}
                  >
                    <span className="text-lg font-medium">{field.value || '12'}</span>
                    <span className="text-sm ml-1 text-[#666666]">일</span>
                  </button>
                )}
              />
            </div>
            {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
              <p className="text-red-500 text-sm mt-2 ml-1">생년월일을 정확히 선택해주세요.</p>
            )}
          </section>

          {/* Question 3: Gender */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-3">성별을 선택해주세요</h3>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange('male')}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg border transition-all ${field.value === 'male' ? 'bg-[#FF8B7D] border-[#FF8B7D] text-white shadow-md' : 'bg-white border-[#EBEBE6] text-[#666666]'}`}
                  >
                    남성
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('female')}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg border transition-all ${field.value === 'female' ? 'bg-[#FF8B7D] border-[#FF8B7D] text-white shadow-md' : 'bg-white border-[#EBEBE6] text-[#666666]'}`}
                  >
                    여성
                  </button>
                </div>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm mt-2 ml-1">{errors.gender.message}</p>
            )}
          </section>

          {/* Question 4: Location */}
          <section className="mb-12">
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-3">어디에 거주하시나요?</h3>
            <div className="space-y-3">
              <Controller
                name="locMain"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => setActiveSheet('locMain')}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border bg-white ${field.value ? 'border-[#FF8B7D] text-[#2D2D2D]' : 'border-[#EBEBE6] text-[#2D2D2D]'}`}
                  >
                    <span className="text-lg">{field.value?.name || '시/도 선택'}</span>
                    <ChevronDown className="w-5 h-5 text-[#999999]" />
                  </button>
                )}
              />
              <Controller
                name="locSub"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => setActiveSheet('locSub')}
                    disabled={!selectedProvince}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border bg-white ${field.value ? 'border-[#FF8B7D] text-[#2D2D2D]' : 'border-[#EBEBE6] text-[#2D2D2D]'} ${!selectedProvince ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-lg">{field.value?.name || '시/군/구 선택'}</span>
                    <ChevronDown className="w-5 h-5 text-[#999999]" />
                  </button>
                )}
              />
            </div>
            {(errors.locMain || errors.locSub) && (
              <p className="text-red-500 text-sm mt-2 ml-1">주소를 끝까지 선택해주세요.</p>
            )}
          </section>
        </form>
      </main>

      {/* Bottom Next Button */}
      <div className="mt-auto p-6 w-full">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isCheckingEmail || Object.keys(errors).length > 0}
          className={`w-full max-w-lg mx-auto rounded-full py-4 text-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                         ${isValid && !isCheckingEmail && Object.keys(errors).length === 0 ? 'bg-[#FF8B7D] text-white hover:bg-[#ff7a6a]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                     `}
        >
          다음 <span className="text-xl">➜</span>
        </button>
      </div>

      {/* Bottom Sheets */}

      <BottomSheet
        isOpen={activeSheet === 'date'}
        onClose={() => setActiveSheet(null)}
        title="생년월일 선택"
        submitText="완료"
        onSubmit={confirmDate}
      >
        <DatePickerWheel
          value={tempDate}
          onChange={handleDateChange}
          years={YEARS}
          months={MONTHS}
          days={daysArray}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'locMain'}
        onClose={() => setActiveSheet(null)}
        title="시/도 선택"
      >
        <div className="flex flex-col gap-1">
          {provinces.map((loc) => (
            <button
              key={loc.code}
              onClick={() => {
                setValue('locMain', loc, { shouldValidate: true });
                setActiveSheet(null);
              }}
              className={`w-full py-4 text-left px-4 text-lg font-medium border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg text-[#4B4B4B]`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'locSub'}
        onClose={() => setActiveSheet(null)}
        title="시/군/구 선택"
      >
        <div className="flex flex-col gap-1">
          {districts.map((loc) => (
            <button
              key={loc.code}
              onClick={() => {
                setValue('locSub', loc, { shouldValidate: true });
                setActiveSheet(null);
              }}
              className={`w-full py-4 text-left px-4 text-lg font-medium border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg text-[#4B4B4B]`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
