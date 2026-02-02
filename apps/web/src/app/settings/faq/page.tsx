'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { FooterNavigation } from '@/components/layout/FooterNavigation';
import { api } from '@/lib/api';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const data = await api.get<FAQ[]>('/faqs');
      setFaqs(data);
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] font-sans pb-20">
      <TopNavigation />

      {/* Header */}
      <header className="bg-white px-4 py-3 sticky top-14 z-10 border-b border-gray-100 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#2D2D2D]" />
        </button>
        <h1 className="text-lg font-bold text-[#2D2D2D]">자주 묻는 질문</h1>
      </header>

      <main className="flex-1 max-w-3xl mx-auto p-6 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#FF8B7D] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFaqs).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-[#FF8B7D] rounded-full" />
                  {category}
                </h2>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <div 
                      key={faq.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleExpand(faq.id)}
                        className="w-full flex items-center justify-between p-5 text-left group"
                      >
                        <span className="text-lg font-bold text-[#2D2D2D] group-hover:text-[#FF8B7D] transition-colors pr-4">
                          {faq.question}
                        </span>
                        {expandedId === faq.id ? (
                          <ChevronUp className="w-6 h-6 text-[#FF8B7D] shrink-0" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-300 shrink-0" />
                        )}
                      </button>
                      
                      {expandedId === faq.id && (
                        <div className="px-5 pb-6 pt-1 animate-[fadeIn_0.3s_ease-out]">
                          <div className="h-[1px] bg-gray-50 mb-4" />
                          <div className="flex gap-3">
                            <div className="mt-1">
                                <span className="bg-[#7D9D85]/10 text-[#7D9D85] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">A</span>
                            </div>
                            <p className="text-lg text-[#666666] leading-relaxed break-keep">
                                {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {faqs.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <HelpCircle className="w-16 h-16 text-gray-200 mx-auto" />
                <p className="text-lg text-gray-400">등록된 질문이 없습니다.</p>
              </div>
            )}
            
            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center">
              <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">원하는 답변을 찾지 못하셨나요?</h3>
              <p className="text-[#666666] mb-6">1:1 문의를 통해 친절하게 답변해 드릴게요.</p>
              <button 
                onClick={() => router.push('/settings')}
                className="bg-white text-[#2D2D2D] px-8 py-3.5 rounded-full text-lg font-bold border-2 border-gray-200 hover:border-[#FF8B7D] hover:text-[#FF8B7D] transition-all active:scale-95"
              >
                1:1 문의하기
              </button>
            </section>
          </div>
        )}
      </main>

      <FooterNavigation />
    </div>
  );
}
