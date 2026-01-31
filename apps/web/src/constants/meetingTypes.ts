export interface MeetingType {
  code: string;
  label: string;
  icon: string; // Emoji
}

export const MEETING_TYPE_CODES: MeetingType[] = [
  { code: 'M001', label: '같이 취미를 즐길 친구', icon: '🎹' },
  { code: 'M002', label: '대화를 나눌 수 있는 동반자', icon: '🗨️' },
  { code: 'M003', label: '재혼을 고려할 수 있는 인연', icon: '❤️' },
  { code: 'M004', label: '가볍게 식사나 차를 마실 지인', icon: '☕' },
];
