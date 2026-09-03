import React, { useState, useEffect } from 'react';
import { Agent, Comment, User } from '../types';
import { 
  X, ThumbsUp, Eye, Copy, Check, MessageSquare, Award, Send, 
  Play, Calendar, Contact, AlertCircle, Sparkles, Trophy, Shield, Terminal, Code
} from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS, REACTION_EMOJIS } from '../data/mockData';
import { getDeviceId } from '../utils';

interface AgentDetailProps {
  agent: Agent;
  comments: Comment[];
  currentUser: User | null;
  onClose: () => void;
  onLike: (agentId: string) => void;
  onReact: (agentId: string, emoji: string) => void;
  onAddComment: (agentId: string, content: string) => void;
  onUpdateBadge: (agentId: string, badge: Agent['badge']) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Simple Markdown-to-HTML parser for beautiful, clean formatting of prompts and outputs
function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-800">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        // Headers
        if (trimmed.startsWith('# ')) {
          return <h1 key={index} className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4">{trimmed.replace('# ', '')}</h1>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={index} className="text-lg font-bold text-slate-900 mt-3">{trimmed.replace('## ', '')}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={index} className="text-base font-bold text-slate-800 mt-2">{trimmed.replace('### ', '')}</h3>;
        }
        // Tables (simple parsing)
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && !trimmed.includes('---')) {
          const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
          return (
            <div key={index} className="overflow-x-auto my-1">
              <table className="min-w-full border-collapse border border-slate-200">
                <tbody>
                  <tr className="bg-slate-50">
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} className="border border-slate-200 px-3 py-1.5 text-xs text-slate-700 font-medium">{cell}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        // Bullet points
        if (trimmed.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 list-disc text-slate-700">
              {parseBoldText(trimmed.replace('- ', ''))}
            </li>
          );
        }
        // Bold text replacement
        return <p key={index} className="min-h-[1.2em]">{parseBoldText(line)}</p>;
      })}
    </div>
  );
}

function parseBoldText(line: string): React.ReactNode {
  const parts = line.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-slate-900">{part}</strong>;
    }
    return part;
  });
}

// Preset inputs for our mock agents to make sandbox playing extremely easy and fun
const PLAYGROUND_PRESETS: Record<string, { placeholder: string; defaultVal: string }> = {
  'agent-1': {
    placeholder: '예: 동남아 철강 선적 예정일과 물량을 입력해 보세요.',
    defaultVal: `선적 국가: 베트남 (호치민 Port)
철강재 유형: 열연 코일 (Hot Rolled Coil)
예정일: 2026년 7월 20일
물량: 850 M/T
컨테이너 규격: 20ft Standard`
  },
  'agent-2': {
    placeholder: '영문 원자재 계약서의 일부 요약본을 검토해 보세요.',
    defaultVal: `ARTICLE 12: LIMITATION OF LIABILITY
Seller's total cumulative liability for any and all claims, including liquidated damages, arising out of this Petrochemical supply agreement shall not exceed 5% of the total contract value. However, the Buyer shall indemnify Seller for all environmental penalties resulting from transport issues. Any dispute shall be governed solely by the laws of Texas, and arbitrated in Houston, US.`
  },
  'agent-3': {
    placeholder: '관세나 탄소국경조정제도 모니터링이 필요한 품목을 지정해 보세요.',
    defaultVal: `대상 품목: 냉연 강판 (Cold Rolled Steel Sheet)
HS Code: 7209.16
수출 대상국: EU (독일)
특이사항: 탄소 배출 기준 및 CBAM 요건 인증 정보 필요.`
  },
  'agent-4': {
    placeholder: '견적 산출에 필요한 사양 정보와 단가 변수를 기입해 보세요.',
    defaultVal: `요청 부품: 3상 모터 감속기 (3-Phase Motor Gearbox)
주문 수량: 120 Units
원가 기준단가: $140 USD
목표 마진율: 18%
인코텀즈: CIF Jakarta Port
적용 환율: 1 USD = 1,385 KRW`
  },
  'agent-5': {
    placeholder: '시세 예측 및 트레이딩 분석 조건을 기입해 보세요.',
    defaultVal: `광물 유형: 발전용 무연탄 (Steam Coal)
기준 인도네시아 HBA 가격: $92.5/Ton
LME 원자재 지수 변동: 지난 주 대비 +3.4% 상승
선적 운임료 조건: FOB Kalimantan`
  },
  'agent-6': {
    placeholder: '해외 바이어가 남긴 컴플레인 이메일 본문을 붙여넣어 보세요.',
    defaultVal: `To: Hyundai Corp Export Support Team
Subject: DEVASTATING DELAYS ON SHIPMENT #HD-402

We are writing to express our extreme disappointment regarding the steel plates scheduled to arrive at our Hamburg warehouse on June 25th. It is now July 1st, and your logistics agent informs us the cargo is still sitting in Singapore!
This delay has halted our factory production line, and our clients are demanding heavy financial damages. We need immediate delivery and a compensation proposal by tomorrow, or we will terminate all future trade agreements.

Regards,
Hans Mueller, Director at EuroSteel GmbH`
  }
};

export default function AgentDetail({
  agent,
  comments,
  currentUser,
  onClose,
  onLike,
  onReact,
  onAddComment,
  onUpdateBadge,
  onEdit,
  onDelete
}: AgentDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo'>('overview');
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Password Modal State
  const [passwordModalConfig, setPasswordModalConfig] = useState<{ isOpen: boolean, action: 'edit' | 'delete' | null }>({ isOpen: false, action: null });
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleActionClick = (action: 'edit' | 'delete') => {
    setPasswordModalConfig({ isOpen: true, action });
    setInputPassword('');
    setPasswordError('');
  };
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const displayImages = agent.screenUrls && agent.screenUrls.length > 0 
    ? agent.screenUrls 
    : (agent.thumbnailUrl ? [agent.thumbnailUrl] : ["https://picsum.photos/id/20/800/450"]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };
  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };
  
  // Playground States
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [healthMessage, setHealthMessage] = useState<string | null>(null);

  // Load preset value when agent changes
  useEffect(() => {
    const preset = PLAYGROUND_PRESETS[agent.id];
    if (preset) {
      setSandboxInput(preset.defaultVal);
    } else {
      setSandboxInput('에이전트에 적용할 매개변수나 관련 비즈니스 텍스트를 자유롭게 입력해 주세요.');
    }
    setSandboxOutput('');
    setActiveTab('overview');
    
    // Check Backend Health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (!data.geminiConfigured) {
          setHealthMessage(data.message);
        } else {
          setHealthMessage(null);
        }
      })
      .catch(() => {
        setHealthMessage("백엔드 서버 통신 장애가 발생했습니다. 실시간 테스트 탭이 제한될 수 있습니다.");
      });
  }, [agent.id]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agent.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(agent.id, commentText);
    setCommentText('');
  };

  const handleRunAgent = async () => {
    if (!sandboxInput.trim()) return;
    setIsRunning(true);
    setSandboxOutput('');
    
    // Stagger loading messages for premium UX
    const loaderTexts = [
      "🔄 H-Agent Core 인스턴스를 초기화하는 중...",
      "⚙️ 시스템 프롬프트 및 파라미터를 파싱하는 중...",
      "🧠 Gemini 3.5 Flash 추론 엔진 구동 중...",
      "📊 최적의 비즈니스 예측값 및 서식을 가공하는 중..."
    ];
    
    let textIdx = 0;
    setLoadingText(loaderTexts[0]);
    const textInterval = setInterval(() => {
      textIdx++;
      if (textIdx < loaderTexts.length) {
        setLoadingText(loaderTexts[textIdx]);
      }
    }, 1500);

    try {
      const response = await fetch('/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: agent.prompt,
          userInput: sandboxInput
        })
      });

      const data = await response.json();
      clearInterval(textInterval);

      if (response.ok) {
        setSandboxOutput(data.output);
      } else {
        setSandboxOutput(`⚠️ 에러가 발생했습니다:\n${data.error}`);
      }
    } catch (err: any) {
      clearInterval(textInterval);
      setSandboxOutput(`⚠️ 통신 중 에러가 발생했습니다. 백엔드 동작 여부를 확인해 주세요.\n${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in" id="agent-detail-backdrop">
      <div 
        className="relative bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col h-[850px] max-h-[95vh] overflow-hidden border border-slate-200"
        id="agent-detail-modal"
      >
        {/* Modal Header */}
        <div className="bg-hyundai-navy text-white px-6 py-4 flex justify-between items-start border-b border-hyundai-blue/30">
          <div className="space-y-1 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${CATEGORY_COLORS[agent.category]?.bg} ${CATEGORY_COLORS[agent.category]?.text} ${CATEGORY_COLORS[agent.category]?.border}`}>
                {CATEGORY_LABELS[agent.category]}
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white leading-snug">{agent.name}</h2>
            <p className="text-slate-300 text-xs flex items-center gap-1.5 font-medium">
              <span>제작자: <strong className="text-white">{agent.creatorName}</strong> ({agent.creatorDept})</span>
              <span className="h-2 w-px bg-white/20"></span>
              <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(agent.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleActionClick('edit')}
              className="text-slate-300 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors border border-slate-500/50 hover:border-white"
            >
              수정
            </button>
            <button
              onClick={() => handleActionClick('delete')}
              className="text-slate-300 hover:text-rose-400 text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors border border-slate-500/50 hover:border-rose-400"
            >
              삭제
            </button>
            <div className="h-4 w-px bg-white/20 mx-1"></div>
            <button 
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              id="detail-close-btn"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Password Confirmation Modal */}
        {passwordModalConfig.isOpen && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                {passwordModalConfig.action === 'edit' ? '에이전트 수정' : '에이전트 삭제'}
              </h3>
              
              {agent.password ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">비밀번호 (4자리 숫자)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={inputPassword}
                    onChange={(e) => {
                      setInputPassword(e.target.value.replace(/\D/g, ''));
                      setPasswordError('');
                    }}
                    className="w-full text-sm p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-hyundai-blue"
                    placeholder="비밀번호 입력"
                    autoFocus
                  />
                  {passwordError && <p className="text-xs text-rose-500 font-bold">{passwordError}</p>}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  이 에이전트는 등록된 비밀번호가 없습니다. 정말로 {passwordModalConfig.action === 'edit' ? '수정' : '삭제'}하시겠습니까?
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setPasswordModalConfig({ isOpen: false, action: null })}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    if (agent.password && agent.password !== inputPassword) {
                      setPasswordError('비밀번호가 일치하지 않습니다.');
                      return;
                    }
                    if (passwordModalConfig.action === 'edit' && onEdit) {
                      onEdit();
                    } else if (passwordModalConfig.action === 'delete' && onDelete) {
                      onDelete();
                    }
                    setPasswordModalConfig({ isOpen: false, action: null });
                  }}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors ${
                    passwordModalConfig.action === 'delete' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-hyundai-blue hover:bg-blue-700'
                  }`}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="bg-slate-50 border-b border-slate-200 flex w-full text-base" id="detail-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 justify-center py-4 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'overview' ? 'border-hyundai-blue text-hyundai-blue bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Contact className="h-5 w-5" />
            <span>Agent 소개</span>
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 justify-center py-4 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'demo' ? 'border-hyundai-blue text-hyundai-blue bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Play className="h-5 w-5" />
            <span>Agent 시연 영상</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8" id="detail-body">
          
          {/* 1. Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in" id="tab-overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">해결하고자 하는 업무 Pain Point</h4>
                    <div className="bg-red-50/70 border-l-4 border-red-500 p-4 rounded-r-lg">
                      <p className="text-sm text-slate-800 font-medium leading-relaxed">
                        🚨 {agent.painPoint}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">도입 시 기대 효과 및 목표</h4>
                    <div className="bg-emerald-50/70 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                      <p className="text-sm text-slate-800 font-medium leading-relaxed">
                        📈 {agent.expectation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Creator Contact Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 h-fit">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Contact className="h-4 w-4 text-hyundai-blue" />
                    <span>제작자</span>
                  </h4>
                  <div className="space-y-3 text-xs text-slate-700">
                    <div>
                      <p className="text-slate-400 font-semibold mb-0.5">이름/부서</p>
                      <p className="font-bold text-slate-900 text-sm">{agent.creatorName} / {agent.creatorDept}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-0.5">연락처</p>
                      <p className="font-medium text-slate-900 text-sm">{agent.creatorContact || 'contact@hyundaicorp.com'}</p>
                    </div>
                  </div>

                  {/* Admin Badge Management */}
                  {currentUser?.role === 'admin' && (
                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Shield className="h-3 w-3 text-slate-500" />
                        <span>관리자 전용 우수 등급 부여</span>
                      </p>
                      <select
                        value={agent.badge || ''}
                        onChange={(e) => onUpdateBadge(agent.id, (e.target.value || null) as Agent['badge'])}
                        className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-hyundai-blue"
                        id="admin-badge-select"
                      >
                        <option value="">등급 없음</option>
                        <option value="best_month">이달의 우수 Agent (최고 영예)</option>
                        <option value="excellent">우수 에이전트 (DACON 추천)</option>
                        <option value="creative">창의 혁신상 (창의성/파급력)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              {/* 주요 구현 기능 리스트 */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">🔍 주요 구현 기능 리스트</h4>
                <div className="flex flex-col gap-4">
                  {agent.features.map((feature, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-start space-x-3 shadow-sm hover:border-blue-100 transition-colors">
                      <div className="h-6 w-6 rounded-full bg-blue-50 text-hyundai-blue border border-blue-100 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-inner">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-800 font-medium leading-relaxed pt-0.5">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent 화면 (Carousel) */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">💻 Agent 화면</h4>
                <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-slate-800 group">
                  <img src={displayImages[activeImageIndex]} alt="Agent Screen" className="w-full h-full object-cover opacity-90 transition-opacity" />
                  
                  {/* Prev/Next buttons */}
                  {displayImages.length > 1 && (
                    <>
                      <button onClick={handlePrevImage} className="absolute left-4 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={handleNextImage} className="absolute right-4 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {displayImages.map((_, idx) => (
                      <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-2 h-2 rounded-full transition-colors ${idx === activeImageIndex ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Agent 영상 */}
              {agent.videoUrl && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">🎬 Agent 시연 영상</h4>
                  <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-slate-800">
                    <video src={agent.videoUrl} controls className="w-full h-full object-contain" />
                  </div>
                </div>
              )}

              {/* Core Response Reactions Bar */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">🙌 이 에이전트가 업무에 도움이 되었나요?</h4>
                    <p className="text-[11px] text-slate-500">실제 업무 도입 및 동료들의 피드백을 축적하여 우수 에이전트를 가려냅니다.</p>
                  </div>

                  {/* Simplified Like/Helpful Button */}
                  <button
                    onClick={() => onLike(agent.id)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      agent.likedBy.includes(getDeviceId())
                        ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                    }`}
                    id="btn-detail-like"
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${agent.likedBy.includes(getDeviceId()) ? 'fill-rose-500 text-rose-600' : ''}`} />
                    <span>도움돼요 ({agent.likes})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Tab Content: Agent 시연 영상 (demo) */}
          {activeTab === 'demo' && (
            <div className="space-y-6 animate-fade-in h-full flex flex-col" id="tab-demo">
              <h4 className="text-sm font-bold text-slate-900">▶️ Agent 시연 영상</h4>
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex-grow shadow-lg border border-slate-800 flex items-center justify-center">
                {agent.videoUrl ? (
                  <video 
                    src={agent.videoUrl} 
                    controls 
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-sm font-medium">등록된 시연 영상이 없습니다.</div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
