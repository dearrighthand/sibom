export interface Hobby {
  code: string;
  label: string;
  icon: string; // Emoji for now, can be replaced with image path
}

export const HOBBY_CODES: Hobby[] = [
  { code: 'H001', label: '산책/등산', icon: '🏃' },
  { code: 'H002', label: '독서', icon: '📖' },
  { code: 'H003', label: '종교활동', icon: '🙏' },
  { code: 'H004', label: '음악감상', icon: '🎵' },
  { code: 'H005', label: '미술/전시', icon: '🎨' },
  { code: 'H006', label: '요리', icon: '🍳' },
  { code: 'H007', label: '손주 돌보기', icon: '👶' },
  { code: 'H008', label: '운동/건강', icon: '💪' },
  { code: 'H009', label: '공연관람', icon: '🎭' },
  { code: 'H010', label: 'TV/영화', icon: '📺' },
];
