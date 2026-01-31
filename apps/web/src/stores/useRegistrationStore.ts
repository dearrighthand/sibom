import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationItem {
  code: string;
  name: string;
}

interface RegistrationState {
  // Step 2: Basic Profile
  name: string;
  birthYear: number | null;
  birthMonth: number | null;
  birthDay: number | null;
  gender: 'male' | 'female' | null;
  locMain: LocationItem | null;
  locSub: LocationItem | null;

  // Step 3: Account Info
  email?: string;
  password?: string;

  // Step 4: Self Intro
  intro: string;

  // Step 5: Hobbies
  hobbies: string[];

  // Step 6: Meeting Type
  meetingType: string | null;

  // Step 7: Profile Photo
  profileImage: string | null;

  // Phone Number (Hidden step, collected at start)
  phoneNumber: string | null;

  // Actions
  setProfileData: (data: Partial<RegistrationState>) => void;
  setIntro: (text: string) => void;
  setHobbies: (hobbies: string[]) => void;
  setMeetingType: (type: string) => void;
  setProfileImage: (image: string | null) => void;
  setPhoneNumber: (phone: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      name: '',
      birthYear: null,
      birthMonth: null,
      birthDay: null,
      gender: null,
      locMain: null,
      locSub: null,
      intro: '',
      hobbies: [],
      meetingType: null,
      profileImage: null,
      phoneNumber: null,

      setProfileData: (data) => set((state) => ({ ...state, ...data })),
      setIntro: (text) => set({ intro: text }),
      setHobbies: (hobbies) => set({ hobbies }),
      setMeetingType: (type) => set({ meetingType: type }),
      setProfileImage: (image) => set({ profileImage: image }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      reset: () =>
        set({
          name: '',
          birthYear: null,
          birthMonth: null,
          birthDay: null,
          gender: null,
          locMain: null,
          locSub: null,
          intro: '',
          hobbies: [],
          meetingType: null,
          profileImage: null,
          phoneNumber: null,
          email: undefined,
          password: undefined,
        }),
    }),
    {
      name: 'registration-storage',
    },
  ),
);
