'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ChevronLeft, MoreVertical, Send, Sparkles, X, Flag, Ban, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useDialog } from '@/hooks/useDialog';
import NextImage from 'next/image';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string; // ISO date string
  isMine: boolean;
}

interface ChatData {
  matchId: string;
  partner: {
      name: string;
      images: string[];
      id: string;
      userId: string;
  };
  messages: Message[];
}

function ChatRoomContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get('id');
  const router = useRouter();
  const { alert, confirm } = useDialog();
  const [data, setData] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [reportCustomReason, setReportCustomReason] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !matchId) return;

    try {
        const response = await api.get<ChatData>(`/messages/${matchId}?userId=${userId}`);
        setData(response);
        setMessages(response.messages);
    } catch (_error) {
        console.error('Fetch error:', _error);
    }
  }, [matchId]);

  // Poll for new messages (simple implementation)
  useEffect(() => {
    if (!matchId) return;
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [matchId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Profanity/inappropriate language filter
  const PROFANITY_LIST = [
    // Common Korean profanity
    '시발', '씨발', '씨빨', '시빨', '씨바', '시바',
    '병신', '븅신', '빙신',
    '지랄', '찐따', '찐다',
    '개새끼', '개색끼', '개세끼', '개쉐끼',
    '미친놈', '미친년', '미친새끼',
    '죽어', '뒤져', '꺼져',
    '년', '놈', // When used offensively
    '새끼', '색끼', '쉐끼',
    '썅', '좆', '자지', '보지',
    'ㅅㅂ', 'ㅂㅅ', 'ㅈㄹ', 'ㅆㅂ',
    '18', '18놈', '18년',
    '닥쳐', '입닥쳐',
    '븅딱', '에미', '애미', '애비', '에비',
  ];

  const containsProfanity = (text: string): boolean => {
    const normalizedText = text.toLowerCase().replace(/\s/g, '');
    return PROFANITY_LIST.some((word) => normalizedText.includes(word));
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !matchId) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Check for profanity
    if (containsProfanity(inputText)) {
      await alert(
        '부적절한 표현 감지',
        '비속어나 욕설이 포함된 메시지는 보낼 수 없어요.\n서로 존중하는 대화를 부탁드려요. 💚'
      );
      return;
    }

    try {
        const content = inputText;
        setInputText(''); // Optimistic clear
        
        await api.post('/messages', {
            userId,
            matchId,
            content
        });
        
        fetchMessages();
    } catch (_error) {
        console.error('Send error:', _error);
        setInputText(inputText); // Restore on fail
    }
  };

  const handleAiRequest = async (type: 'START' | 'REPLY' | 'PROPOSE' | 'EMOTION') => {
      setAiLoading(true);
      setAiSuggestions([]);
      const userId = localStorage.getItem('userId');
      if (!userId || !data) return;

      try {
          const history = messages.slice(-5).map(m => ({
              sender: m.isMine ? '나' : '상대방',
              content: m.content
          }));

          const response = await api.post<{ suggestions: string[] }>('/ai/chat-suggestions', {
              userId,
              partnerId: data.partner.userId || data.partner.id,
              type,
              history
          });
          
          setAiSuggestions(response.suggestions);
      } catch (_error) {
          console.error('AI error:', _error);
          setAiSuggestions(['오류가 발생했습니다. 다시 시도해주세요.']);
      } finally {
          setAiLoading(false);
      }
  };

  const selectSuggestion = (text: string) => {
      setInputText(text);
      setIsAiOpen(false);
      setAiSuggestions([]);
  };

  // More Menu Actions
  const handleLeaveChat = async () => {
    const isConfirmed = await confirm(
        '대화 나가기',
        '정말 이 대화방을 나가시겠습니까? 나간 후에는 대화 목록에서 사라집니다.',
        '나가기',
        '취소'
    );

    if (isConfirmed && data) {
        const userId = localStorage.getItem('userId');
        try {
            await api.post('/matches/leave', { userId, matchId });
            router.push('/chat');
        } catch {
            alert('오류', '처리에 실패했습니다.');
        }
    }
  };

  const handleBlockUser = async () => {
    const isConfirmed = await confirm(
        '차단하기',
        '정말 이 사용자를 차단하시겠습니까? 서로 더 이상 보이지 않게 됩니다.',
        '차단',
        '취소'
    );

    if (isConfirmed && data) {
        const userId = localStorage.getItem('userId');
        try {
            await api.post('/matches/block', { 
                userId, 
                targetId: data.partner.userId || data.partner.id 
            });
            router.push('/chat');
        } catch {
            alert('오류', '처리에 실패했습니다.');
        }
    }
  };

  const reportReasons = [
    '불쾌한 언행/욕설',
    '부적절한 성적 메시지',
    '광고/스팸',
    '사기/금전 요구',
    '기타'
  ];

  const handleReportUser = async (reason: string) => {
    if (!data) return;
    const userId = localStorage.getItem('userId');
    try {
        await api.post('/matches/report', { 
            userId, 
            targetId: data.partner.userId || data.partner.id,
            reason: reason || '기타'
        });
        await alert('신고 완료', '정상적으로 접수되었습니다. 관리자 검토 후 조치하겠습니다.');
        setIsReportOpen(false);
        setIsMoreOpen(false);
        setReportCustomReason('');
        setSelectedReason('');
    } catch {
        alert('오류', '처리에 실패했습니다.');
    }
  };

  if ((!data && messages.length === 0) || !matchId) {
      return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-[#F2F4F6]">
      {/* Header */}
      <header 
        className="bg-white px-4 flex items-center justify-between border-b border-gray-200 shrink-0"
        style={{ 
            paddingTop: 'calc(12px + var(--safe-area-inset-top, 0px))',
            paddingBottom: '12px'
        }}
      >
          <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600">
              <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#2D2D2D]">
                    {data?.partner.name || '상대방'}
                </span>
                {data?.partner.images[0] && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                        <NextImage 
                            src={data.partner.images[0]} 
                            fill
                            className="object-cover" 
                            alt="Profile"
                        />
                    </div>
                )}
             </div>
          </div>

          <button onClick={() => setIsMoreOpen(true)} className="p-2 -mr-2 text-gray-600">
              <MoreVertical size={24} />
          </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
              <div 
                key={msg.id || idx} 
                className={`flex w-full ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              >
                  {!msg.isMine && (
                      <div className="relative w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2 shrink-0">
                          {data?.partner.images[0] && (
                             <NextImage src={data.partner.images[0]} fill className="object-cover" alt="Partner" />
                          )}
                      </div>
                  )}
                  
                  <div className={`max-w-[70%] flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`px-4 py-2 rounded-2xl text-[16px] leading-relaxed shadow-sm
                            ${msg.isMine 
                                ? 'bg-[#5CB85C] text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                            }`}
                      >
                          {msg.content}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 px-1">
                          {format(new Date(msg.createdAt), 'a h:mm', { locale: ko })}
                      </span>
                  </div>
              </div>
          ))}
          <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div 
        className="bg-white px-4 border-t border-gray-200 shrink-0"
        style={{ 
            paddingTop: '12px',
            paddingBottom: 'calc(12px + var(--safe-area-inset-bottom, 0px))' 
        }}
      >
          <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsAiOpen(true)}
                className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap border border-purple-200"
              >
                  <Sparkles size={16} />
                  AI 도움
              </button>
              
              <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2">
                  <input 
                      type="text"
                      className="flex-1 bg-transparent outline-none text-[#2D2D2D] placeholder-gray-400 text-base"
                      placeholder="메시지를 입력하세요"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                              handleSendMessage();
                          }
                      }}
                  />
              </div>
              
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`p-3 rounded-full flex items-center justify-center transition-colors
                    ${inputText.trim() 
                        ? 'bg-[#FF6B6B] text-white shadow-md' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
              >
                  <Send size={20} />
              </button>
          </div>
      </div>

      {/* AI Help Sheet */}
      {isAiOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsAiOpen(false)}>
              <div 
                className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-xl animate-slide-up"
                onClick={e => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                              <Sparkles size={18} />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">AI 대화 도우미</h3>
                      </div>
                      <button onClick={() => setIsAiOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={24} />
                      </button>
                  </div>

                  {!aiLoading && aiSuggestions.length === 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => handleAiRequest('START')} className="bg-purple-50 p-4 rounded-xl text-left border border-purple-100">
                              <div className="font-bold text-purple-900 mb-1">👋 대화 시작</div>
                              <div className="text-xs text-purple-700">첫 인사가 어려울 때</div>
                          </button>
                          <button onClick={() => handleAiRequest('REPLY')} className="bg-blue-50 p-4 rounded-xl text-left border border-blue-100">
                              <div className="font-bold text-blue-900 mb-1">💬 답장 추천</div>
                              <div className="text-xs text-blue-700">할 말이 떠오르지 않을 때</div>
                          </button>
                          <button onClick={() => handleAiRequest('PROPOSE')} className="bg-green-50 p-4 rounded-xl text-left border border-green-100">
                              <div className="font-bold text-green-900 mb-1">☕️ 만남 제안</div>
                              <div className="text-xs text-green-700">자연스럽게 만나자고 할 때</div>
                          </button>
                          <button onClick={() => handleAiRequest('EMOTION')} className="bg-pink-50 p-4 rounded-xl text-left border border-pink-100">
                              <div className="font-bold text-pink-900 mb-1">🥰 감정 표현</div>
                              <div className="text-xs text-pink-700">따뜻한 마음을 전할 때</div>
                          </button>
                      </div>
                  ) : (
                       <div className="space-y-4">
                           {aiLoading ? (
                               <div className="flex flex-col items-center justify-center py-8">
                                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                                   <p className="text-gray-500 text-sm">AI가 적절한 말을 찾고 있어요...</p>
                               </div>
                           ) : (
                               <div className="space-y-3">
                                   <p className="text-sm text-gray-500 mb-2">마음에 드는 문구를 선택하세요:</p>
                                   {aiSuggestions.map((text, idx) => (
                                       <button
                                           key={idx}
                                           onClick={() => selectSuggestion(text)}
                                           className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-purple-50 border border-gray-100 text-gray-800"
                                       >
                                           &quot;{text}&quot;
                                       </button>
                                   ))}
                                   <button onClick={() => setAiSuggestions([])} className="w-full py-2 text-gray-400 text-sm mt-2 underline">
                                       다른 상황 선택하기
                                   </button>
                               </div>
                           )}
                       </div>
                  )}
              </div>
          </div>
      )}

      {/* More Menu Sheet */}
      {isMoreOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsMoreOpen(false)}>
              <div 
                className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-12 shadow-xl animate-slide-up"
                onClick={e => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-800">더 보기</h3>
                      <button onClick={() => setIsMoreOpen(false)} className="text-gray-400">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="space-y-2">
                      <button 
                        onClick={() => setIsReportOpen(true)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors text-[#2D2D2D] font-medium"
                      >
                          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                              <Flag size={20} />
                          </div>
                          <span>신고하기</span>
                      </button>

                      <button 
                        onClick={handleBlockUser}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors text-red-600 font-medium"
                      >
                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                              <Ban size={20} />
                          </div>
                          <span>차단하기</span>
                      </button>

                      <div className="h-px bg-gray-100 my-2" />

                      <button 
                        onClick={handleLeaveChat}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors text-gray-600 font-medium"
                      >
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              <LogOut size={20} />
                          </div>
                          <span>대화 나가기</span>
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Report Reason Sheet */}
      {isReportOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsReportOpen(false)}>
              <div 
                className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-12 shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-800">신고 사유 선택</h3>
                      <button onClick={() => setIsReportOpen(false)} className="text-gray-400">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="space-y-3">
                      {reportReasons.map((reason) => (
                          <button
                            key={reason}
                            onClick={() => setSelectedReason(reason)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                selectedReason === reason 
                                ? 'bg-amber-50 border-amber-500 text-amber-900 border-2' 
                                : 'bg-gray-50 border-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            <span className="font-semibold">{reason}</span>
                          </button>
                      ))}

                      {selectedReason === '기타' && (
                          <div className="mt-4 animate-fade-in">
                              <textarea 
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-amber-500 transition-colors text-base placeholder-gray-400 resize-none"
                                placeholder="신고 사유를 직접 입력해주세요 (최소 5자 이상)"
                                value={reportCustomReason}
                                onChange={(e) => setReportCustomReason(e.target.value)}
                              />
                          </div>
                      )}

                      <div className="pt-4 flex gap-3">
                        <button 
                            onClick={() => setIsReportOpen(false)}
                            className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-lg"
                        >
                            취소
                        </button>
                        <button 
                            disabled={!selectedReason || (selectedReason === '기타' && reportCustomReason.trim().length < 5)}
                            onClick={() => handleReportUser(selectedReason === '기타' ? reportCustomReason : selectedReason)}
                            className={`flex-[2] py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all
                                ${(!selectedReason || (selectedReason === '기타' && reportCustomReason.trim().length < 5))
                                    ? 'bg-gray-300 shadow-none' 
                                    : 'bg-[#FF6B6B] hover:bg-[#ff5252] shadow-[#FF6B6B]/30'
                                }`}
                        >
                            신고 접수
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default function ChatRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩중...</div>}>
      <ChatRoomContent />
    </Suspense>
  );
}
