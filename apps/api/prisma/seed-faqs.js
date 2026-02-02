const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const faqs = [
    {
      category: '서비스 이용',
      question: '시봄(SIBOM)은 어떤 서비스인가요?',
      answer: '시봄은 시니어분들의 활기찬 사회 활동과 새로운 인연을 돕는 맞춤형 매칭 플랫폼입니다.',
      order: 1,
    },
    {
      category: '서비스 이용',
      question: '회원가입은 어떻게 하나요?',
      answer: '휴대폰 번호 인증을 통해 간편하게 가입하실 수 있습니다. 가입 과정에서 간단한 프로필 정보를 입력해주시면 됩니다.',
      order: 2,
    },
    {
      category: '매칭 및 대화',
      question: '매칭은 어떻게 이루어지나요?',
      answer: '매일 AI가 추천해드리는 오늘의 인연 혹은 관심사 검색을 통해 서로 호감을 표시하고, 상대방이 수락하면 대화를 시작하실 수 있습니다.',
      order: 3,
    },
    {
      category: '매칭 및 대화',
      question: '호감 표시는 무엇인가요?',
      answer: "관심 있는 프로필을 발견했을 때 '좋아요'를 눌러 마음을 전하는 기능입니다.",
      order: 4,
    },
    {
      category: '계정 및 보안',
      question: '비밀번호를 잊어버렸어요.',
      answer: '로그인 화면의 비밀번호 찾기 기능을 이용하시거나, 고객센터로 문의해주시면 확인을 도와드립니다.',
      order: 5,
    },
    {
      category: '계정 및 보안',
      question: '탈퇴하고 싶어요.',
      answer: '설정 > 계정 관리 메뉴에서 언제든지 탈퇴하실 수 있습니다. 탈퇴 시 모든 정보는 즉시 삭제되어 복구할 수 없습니다.',
      order: 6,
    },
  ];

  console.log('Seeding FAQs...');
  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: `seed-${faq.order}` },
      update: faq,
      create: {
        id: `seed-${faq.order}`,
        ...faq,
      },
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
