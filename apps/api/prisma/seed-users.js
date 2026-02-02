const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Constants
const HOBBY_CODES = ['H001', 'H002', 'H003', 'H004', 'H005', 'H006', 'H007', 'H008', 'H009', 'H010'];

const LOCATIONS = [
  '서울특별시 강남구',
  '서울특별시 서초구',
  '서울특별시 송파구',
  '서울특별시 마포구',
  '경기도 성남시',
  '경기도 용인시',
  '경기도 고양시',
  '부산광역시 해운대구',
  '부산광역시 남구',
  '대구광역시 수성구',
  '인천광역시 연수구',
  '대전광역시 유성구',
];

const MALE_NAMES = [
  '김영수', '이철호', '박정식', '최동현', '정상민', '강태우', '조성호', '윤재석', '장민호', '임기환',
  '한동수', '오승환', '서진우', '신현석', '권용진', '황정민', '안재호', '송대진', '전성일', '홍길동',
  '유기석', '문성호', '양준혁', '배성진', '백종원', '허준호', '남궁선', '탁재훈', '피종호', '마광수',
  '우정호', '민경훈', '변성호', '진성일', '맹세환', '제갈공', '선우진', '사공정', '독고진', '황보경',
  '길태호', '봉준호', '채동현', '노진환', '방시혁', '국종호', '빈성호', '곽도원', '표창원', '탄성호'
];

const FEMALE_NAMES = [
  '김영희', '이순자', '박정순', '최미영', '정은숙', '강경희', '조미란', '윤정숙', '장혜원', '임미자',
  '한정희', '오미숙', '서영순', '신현주', '권정애', '황은영', '안미경', '송옥순', '전정화', '홍명희',
  '유순자', '문정희', '양미라', '배경숙', '백정희', '허영희', '남순이', '탁영자', '피경희', '마순희',
  '우정희', '민경자', '변정순', '진미란', '맹순자', '제갈란', '선우경', '사공미', '독고란', '황보희',
  '길순자', '봉미영', '채영희', '노경희', '방미란', '국정희', '빈순자', '곽미경', '표영자', '탄순희'
];

const BIOS = [
  '퇴직 후 여유로운 삶을 즐기고 있습니다.',
  '손주들과 함께하는 시간이 가장 행복해요.',
  '건강한 노후를 위해 매일 운동하고 있어요.',
  '새로운 친구를 만나고 싶어요.',
  '조용한 산책과 음악 감상을 좋아합니다.',
  '맛있는 음식 만들기가 취미예요.',
  '독서와 명상으로 하루를 시작해요.',
  '여행 다니는 걸 좋아해요.',
  '정원 가꾸기가 제 낙이에요.',
  '문화생활을 즐기는 편이에요.',
  '봉사활동에 관심이 많아요.',
  '배움에는 나이가 없다고 생각해요.',
];

// Utility functions
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone(index) {
  const prefix = '010';
  const middle = String(Math.floor(1000 + Math.random() * 9000));
  const suffix = String(index).padStart(4, '0');
  return `${prefix}${middle}${suffix}`;
}

function generateEmail(name, index) {
  const domains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];
  const sanitizedName = name.replace(/\s/g, '').toLowerCase();
  return `${sanitizedName}${index}@${getRandomElement(domains)}`;
}

async function main() {
  console.log('Starting test user seeding...');
  
  // Common password for all test users: "test1234"
  const PASSWORD = 'test1234';
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  
  const currentYear = new Date().getFullYear();
  
  // Generate 50 male users
  console.log('Creating 50 male users...');
  for (let i = 0; i < 50; i++) {
    const name = MALE_NAMES[i];
    const age = getRandomInt(51, 70);
    const birthYear = currentYear - age;
    const phone = generatePhone(i + 1);
    const email = generateEmail(name, i + 1);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        profile: {
          create: {
            name,
            birthYear,
            gender: 'MALE',
            location: getRandomElement(LOCATIONS),
            bio: getRandomElement(BIOS),
            interests: getRandomElements(HOBBY_CODES, getRandomInt(2, 5)),
            images: [`https://randomuser.me/api/portraits/men/${i % 100}.jpg`],
          },
        },
      },
    });
    
    console.log(`Created male user: ${name} (${age}세) - ${email}`);
  }
  
  // Generate 50 female users
  console.log('Creating 50 female users...');
  for (let i = 0; i < 50; i++) {
    const name = FEMALE_NAMES[i];
    const age = getRandomInt(51, 70);
    const birthYear = currentYear - age;
    const phone = generatePhone(i + 51);
    const email = generateEmail(name, i + 51);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        profile: {
          create: {
            name,
            birthYear,
            gender: 'FEMALE',
            location: getRandomElement(LOCATIONS),
            bio: getRandomElement(BIOS),
            interests: getRandomElements(HOBBY_CODES, getRandomInt(2, 5)),
            images: [`https://randomuser.me/api/portraits/women/${i % 100}.jpg`],
          },
        },
      },
    });
    
    console.log(`Created female user: ${name} (${age}세) - ${email}`);
  }
  
  console.log('\n✅ Successfully created 100 test users!');
  console.log(`📌 Common Password: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
