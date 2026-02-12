export interface AgeGroup {
  label: string;
  min: number;
  max: number | null; // null for "76+"
}

export interface DistanceOption {
  label: string;
  value: string; // '5km', '10km', '20km', 'nationwide'
}

export const AGE_GROUP_OPTIONS: AgeGroup[] = [
  { label: '50~55세', min: 50, max: 55 },
  { label: '56~60세', min: 56, max: 60 },
  { label: '61~65세', min: 61, max: 65 },
  { label: '66~70세', min: 66, max: 70 },
  { label: '71~75세', min: 71, max: 75 },
  { label: '76세 이상', min: 76, max: null },
];

export const DISTANCE_OPTIONS: DistanceOption[] = [
  { label: '5km', value: '5km' },
  { label: '10km', value: '10km' },
  { label: '20km', value: '20km' },
  { label: '전국', value: 'nationwide' },
];
