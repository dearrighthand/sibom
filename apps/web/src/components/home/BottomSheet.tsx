'use client';

import { X, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HOBBY_CODES } from '@sibom/shared';
import { AGE_GROUP_OPTIONS } from '@/constants/filters';
import { api } from '@/lib/api';

interface LocationItem {
  code: string;
  name: string;
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, unknown>) => void;
  initialLocation?: string;
  initialAge?: string; // e.g. "60대"
  initialInterests?: string[];
}

export function BottomSheet({ isOpen, onClose, onApply, initialLocation, initialAge, initialInterests }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Location State
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<LocationItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LocationItem | null>(null);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Initialize State from Props
  useEffect(() => {
    if (isOpen) {
        if (initialAge) setSelectedAge(initialAge);
        if (initialInterests) setSelectedInterests(initialInterests);
    }
  }, [isOpen, initialAge, initialInterests]);

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

  // Handle Initial Location & Fetch Districts
  useEffect(() => {
    const initLocation = async () => {
        if (initialLocation && provinces.length > 0 && !selectedProvince) {
            const [provName, distName] = initialLocation.split(' ');
            const foundProvince = provinces.find(p => p.name === provName);
            
            if (foundProvince) {
                setSelectedProvince(foundProvince);
                
                // Fetch districts for this province immediately to set district
                try {
                    const districtsData = await api.get<LocationItem[]>(`/locations/districts?provinceCode=${foundProvince.code}`);
                    setDistricts(districtsData);
                    
                    if (distName) {
                        const foundDistrict = districtsData.find(d => d.name === distName);
                        if (foundDistrict) setSelectedDistrict(foundDistrict);
                    }
                } catch (e) {
                    console.error('Failed to fetch districts for init', e);
                }
            }
        }
    };
    
    if (isOpen && initialLocation) {
        initLocation();
    }
  }, [isOpen, initialLocation, provinces]);


  // Fetch Districts when Province changes (User Interaction)
  useEffect(() => {
    if (selectedProvince?.code) {
      const fetchDistricts = async () => {
        try {
          const data = await api.get<LocationItem[]>(`/locations/districts?provinceCode=${selectedProvince.code}`);
          setDistricts(data);
          // If the province changed by user interaction, reset district. 
          // But check if we are currently initializing to avoid resetting.
          // For simplicity, if districts change, we might want to reset selectedDistrict unless it fits?
          // Actually, standard behavior is reset district on province change.
          // We can check if the current selectedDistrict belongs to new list, if not reset.
          // But here, triggering fetch implies change.
           
          // Optimization: Don't reset if it matches the 'initial' loading flow. 
          // But simple reset is safer for user interaction.
          // We'll rely on the separate init logic for initialization.
          // Here, we just check if selectedDistrict is valid.
        } catch (e) {
          console.error('Failed to fetch districts', e);
          setDistricts([]);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
    }
  }, [selectedProvince?.code]);
    
  // However, the above effect runs on mount if selectedProvince is set by init.
  // We need to ensure we don't wipe out selectedDistrict if it was Just set by init.
  // The init logic fetches and sets districts itself.
  // So the effect dependency `selectedProvince?.code` might double fetch.
  // To avoid this complexity, let's keep it simple: 
  // User click -> sets selectedProvince -> sets selectedDistrict(null).
  // Init -> sets selectedProvince (and fetched districts) -> sets selectedDistrict.


  const handleProvinceSelect = (province: LocationItem) => {
      if (selectedProvince?.code !== province.code) {
          setSelectedProvince(province);
          setSelectedDistrict(null); // Reset district on province change
          setIsProvinceOpen(false);
      }
  };

  const toggleInterest = (interestCode: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestCode)
        ? prev.filter(i => i !== interestCode)
        : [...prev, interestCode]
    );
  };

  const handleApply = () => {
    const ageOption = AGE_GROUP_OPTIONS.find(o => o.label === selectedAge);
    
    let locationString = undefined;
    if (selectedProvince) {
        locationString = selectedProvince.name;
        if (selectedDistrict) {
            locationString += ` ${selectedDistrict.name}`;
        }
    }

    onApply({
        ageMin: ageOption?.min,
        ageMax: ageOption?.max,
        location: locationString,
        interestCodes: selectedInterests.length > 0 ? selectedInterests : undefined
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div 
        className={cn(
          "relative w-full max-w-md bg-white rounded-t-[2rem] p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col max-h-[90vh]",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle Bar */}
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-300 shrink-0" />

        {/* Header */}
        <div className="mb-6 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-900">관심사로 찾기</h2>
          <button 
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto pb-24 min-h-0">
          
          {/* Location Section */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-500">거주 지역</h3>
            <div className="space-y-3">
                {/* Province Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsProvinceOpen(!isProvinceOpen)}
                        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl border bg-white ${selectedProvince ? 'border-[#FF8B7D] text-[#2D2D2D]' : 'border-gray-200 text-gray-500'}`}
                    >
                        <span className="text-base font-medium">{selectedProvince?.name || '시/도 선택'}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isProvinceOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isProvinceOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg z-20">
                            {provinces.map((prov) => (
                                <button
                                    key={prov.code}
                                    onClick={() => handleProvinceSelect(prov)}
                                    className="w-full text-left px-5 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-50 last:border-0"
                                >
                                    {prov.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* District Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                        disabled={!selectedProvince}
                        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl border bg-white 
                            ${selectedDistrict ? 'border-[#FF8B7D] text-[#2D2D2D]' : 'border-gray-200 text-gray-500'}
                            ${!selectedProvince ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <span className="text-base font-medium">{selectedDistrict?.name || '시/군/구 선택 (전체)'}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDistrictOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDistrictOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg z-20">
                            <button
                                onClick={() => { setSelectedDistrict(null); setIsDistrictOpen(false); }}
                                className="w-full text-left px-5 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-50"
                            >
                                전체
                            </button>
                            {districts.map((dist) => (
                                <button
                                    key={dist.code}
                                    onClick={() => { setSelectedDistrict(dist); setIsDistrictOpen(false); }}
                                    className="w-full text-left px-5 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-50 last:border-0"
                                >
                                    {dist.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          </section>

          {/* Age Section */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-500">연령대</h3>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUP_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedAge(option.label)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selectedAge === option.label
                      ? "border-[#FF8B7D] bg-[#FFE8E6] text-[#FF8B7D]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Interests Section */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-500">관심사</h3>
            <div className="flex flex-wrap gap-2"> 
              {HOBBY_CODES.map((hobby) => (
                <button
                  key={hobby.code}
                  onClick={() => toggleInterest(hobby.code)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                    selectedInterests.includes(hobby.code)
                      ? "border-[#FF8B7D] bg-[#FFE8E6] text-[#FF8B7D]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {hobby.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Apply Button */}
        <div className="bg-white pt-4 shrink-0 mt-auto">
          <button
            onClick={handleApply}
            className="w-full rounded-xl bg-[#2D2D2D] py-4 text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
          >
            적용하기
          </button>
        </div>

      </div>
    </div>
  );
}
