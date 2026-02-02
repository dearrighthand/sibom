// Vector types for simulation
type InterestVector = Record<string, number>;

interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  interests: string[];
  vector: InterestVector; // Simulated vector
}

// Mock User (The current logged in user)
const CURRENT_USER_VECTOR: InterestVector = {
  '산책': 1,
  '독서': 0.8,
  '미술': 0.5,
  '종교': 0,
  '등산': 0.9,
  '음악': 0.3,
};

// Cosine Similarity Calculation
function cosineSimilarity(vecA: InterestVector, vecB: InterestVector): number {
  const keys = Array.from(new Set([...Object.keys(vecA), ...Object.keys(vecB)]));
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key of keys) {
    const valA = vecA[key] || 0;
    const valB = vecB[key] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Mock Candidate Data
const CANDIDATES: UserProfile[] = [
  {
    id: '1',
    name: '이정숙',
    age: 63,
    location: '서울 강남구',
    interests: ['산책', '미술', '커피'],
    vector: { '산책': 0.9, '미술': 0.8, '커피': 0.6, '독서': 0.2 },
  },
  {
    id: '2',
    name: '박철수',
    age: 65,
    location: '서울 서초구',
    interests: ['독서', '클래식', '여행'],
    vector: { '독서': 0.9, '클래식': 0.7, '여행': 0.6, '산책': 0.3 },
  },
  {
    id: '3',
    name: '김영희',
    age: 61,
    location: '서울 송파구',
    interests: ['요리', '맛집탐방', '건강'],
    vector: { '요리': 0.9, '건강': 0.8, '산책': 0.4 },
  },
  {
    id: '4',
    name: '최영수',
    age: 68,
    location: '서울 강동구',
    interests: ['등산', '바둑'],
    vector: { '등산': 1.0, '바둑': 0.9, '산책': 0.5 },
  },
    {
    id: '5',
    name: '정민자',
    age: 62,
    location: '경기 성남시',
    interests: ['영화', '드라마', '수다'],
    vector: { '영화': 0.8, '드라마': 0.7, '산책': 0.2 },
  },
];

export function getRecommendations() {
  // 1. Calculate Score
  const scoredCandidates = CANDIDATES.map(candidate => {
    const similarity = cosineSimilarity(CURRENT_USER_VECTOR, candidate.vector);
    // Distance simulation: Give slight bonus to 'Seoul' locations for now
    const distanceBonus = candidate.location.includes('서울') ? 0.1 : 0;
    
    return {
      ...candidate,
      score: similarity + distanceBonus,
      matchReason: generateMatchReason(similarity, candidate.interests),
      imageUrl: getImageFor(candidate.id), // Helper
      quote: getQuoteFor(candidate.interests[0]), // Helper
    };
  });

  // 2. Sort by Score (Descending)
  return scoredCandidates.sort((a, b) => b.score - a.score);
}

function generateMatchReason(score: number, interests: string[]) {
  if (score > 0.8) return `취향이 ${Math.round(score * 100)}% 일치해요! 특히 ${interests[0]}에 관심이 많으시네요.`;
  if (score > 0.5) return `관심사가 비슷해요. ${interests.slice(0, 2).join(', ')} 이야기를 나눠보세요.`;
  return '새로운 분야의 대화를 나눠보세요!';
}

function getImageFor(id: string) {
  // Stable placeholder images
    const images = [
        'https://images.unsplash.com/photo-1551843070-6811f9a74bb2?q=80&w=2592&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595152772835-21d74b9671d4?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566616213894-2dcdcf8af83c?q=80&w=2670&auto=format&fit=crop',
         'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=2574&auto=format&fit=crop'
    ];
    return images[parseInt(id) % images.length];
}

function getQuoteFor(interest: string) {
    const quotes: Record<string, string> = {
        '산책': '맑은 공기를 마시며 걷는 것을 좋아합니다.',
        '독서': '조용히 책 읽으며 사색하는 시간이 행복해요.',
        '요리': '맛있는 음식을 만들어 나누는 기쁨이 최고죠.',
        '등산': '정상에서 느끼는 상쾌함, 함께 느껴요.',
        '영화': '감동적인 영화 한 편이면 하루가 행복해요.'
    };
    return quotes[interest] || '함께 즐거운 시간을 보내고 싶어요.';
}
