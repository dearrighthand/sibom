const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// English name mappings for Korean names
const MALE_NAME_ENGLISH = {
  '김영수': 'kimys', '이철호': 'leech', '박정식': 'parkjs', '최동현': 'choidh', '정상민': 'jeongsm',
  '강태우': 'kangtw', '조성호': 'chosh', '윤재석': 'yoonjs', '장민호': 'jangmh', '임기환': 'limkh',
  '한동수': 'hands', '오승환': 'ohsh', '서진우': 'seojw', '신현석': 'shinhs', '권용진': 'kwonyj',
  '황정민': 'hwangjm', '안재호': 'anjh', '송대진': 'songdj', '전성일': 'jeonsi', '홍길동': 'honggd',
  '유기석': 'yooks', '문성호': 'moonsh', '양준혁': 'yangjh', '배성진': 'baesj', '백종원': 'baekjw',
  '허준호': 'heojh', '남궁선': 'namgs', '탁재훈': 'takjh', '피종호': 'peejh', '마광수': 'maks',
  '우정호': 'woojh', '민경훈': 'minkh', '변성호': 'byunsh', '진성일': 'jinsi', '맹세환': 'maengsh',
  '제갈공': 'jegalg', '선우진': 'sunwj', '사공정': 'sakonj', '독고진': 'dokgoj', '황보경': 'hwangbk',
  '길태호': 'kilth', '봉준호': 'bongjh', '채동현': 'chaedh', '노진환': 'nojh', '방시혁': 'bangsh',
  '국종호': 'kookjh', '빈성호': 'binsh', '곽도원': 'kwakdw', '표창원': 'pyocw', '탄성호': 'tansh'
};

const FEMALE_NAME_ENGLISH = {
  '김영희': 'kimyh', '이순자': 'leesj', '박정순': 'parkjs', '최미영': 'choimy', '정은숙': 'jeonges',
  '강경희': 'kangkh', '조미란': 'chomr', '윤정숙': 'yoonjs', '장혜원': 'janghw', '임미자': 'limmj',
  '한정희': 'hanjh', '오미숙': 'ohms', '서영순': 'seoys', '신현주': 'shinhj', '권정애': 'kwonja',
  '황은영': 'hwangey', '안미경': 'anmk', '송옥순': 'songos', '전정화': 'jeonjh', '홍명희': 'hongmh',
  '유순자': 'yoosj', '문정희': 'moonjh', '양미라': 'yangmr', '배경숙': 'baeks', '백정희': 'baekjh',
  '허영희': 'heoyh', '남순이': 'namsi', '탁영자': 'takyj', '피경희': 'peekh', '마순희': 'mash',
  '우정희': 'woojh', '민경자': 'minkj', '변정순': 'byunjs', '진미란': 'jinmr', '맹순자': 'maengsj',
  '제갈란': 'jegalr', '선우경': 'sunwk', '사공미': 'sakongm', '독고란': 'dokgor', '황보희': 'hwangbh',
  '길순자': 'kilsj', '봉미영': 'bongmy', '채영희': 'chaeyh', '노경희': 'nokh', '방미란': 'bangmr',
  '국정희': 'kookjh', '빈순자': 'binsj', '곽미경': 'kwakmk', '표영자': 'pyoyj', '탄순희': 'tansh'
};

const ALL_NAME_ENGLISH = { ...MALE_NAME_ENGLISH, ...FEMALE_NAME_ENGLISH };

async function main() {
  console.log('Updating user emails to English format...\n');
  
  // Get all users with their profiles
  const users = await prisma.user.findMany({
    include: { profile: true }
  });
  
  let updatedCount = 0;
  
  for (const user of users) {
    if (!user.email || !user.profile) continue;
    
    const name = user.profile.name;
    const englishName = ALL_NAME_ENGLISH[name];
    
    if (englishName) {
      // Extract the number suffix from current email
      const match = user.email.match(/(\d+)@/);
      const suffix = match ? match[1] : String(updatedCount + 1);
      const domain = user.email.split('@')[1] || 'gmail.com';
      
      const newEmail = `${englishName}${suffix}@${domain}`;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { email: newEmail }
      });
      
      console.log(`Updated: ${user.email} -> ${newEmail}`);
      updatedCount++;
    }
  }
  
  console.log(`\n✅ Successfully updated ${updatedCount} user emails to English format!`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
