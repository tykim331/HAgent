import React, { useState, useEffect } from 'react';
import { Agent, Comment, User } from '../types';
import { 
  X, ThumbsUp, Eye, Copy, Check, MessageSquare, Award, Send, 
  Play, Calendar, Contact, AlertCircle, Sparkles, Trophy, Shield, Terminal, Code
} from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS, REACTION_EMOJIS } from '../data/mockData';

interface AgentDetailProps {
  agent: Agent;
  comments: Comment[];
  currentUser: User | null;
  onClose: () => void;
  onLike: (agentId: string) => void;
  onReact: (agentId: string, emoji: string) => void;
  onAddComment: (agentId: string, content: string) => void;
  onUpdateBadge: (agentId: string, badge: Agent['badge']) => void;
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
  onUpdateBadge
}: AgentDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'guide' | 'prompt'>('overview');
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  
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
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200"
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
          
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            id="detail-close-btn"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-50 border-b border-slate-200 flex overflow-x-auto text-xs" id="detail-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'overview' ? 'border-hyundai-blue text-hyundai-blue bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Contact className="h-4 w-4" />
            <span>개요 & 기대효과</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-5 py-3 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'features' ? 'border-hyundai-blue text-hyundai-blue bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>주요 기능</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-5 py-3 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'guide' ? 'border-hyundai-blue text-hyundai-blue bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>사용 방법</span>
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-5 py-3 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'prompt' ? 'border-hyundai-blue text-hyundai-blue bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>코드 공유</span>
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
                    <span>제작자 및 피드백 문의</span>
                  </h4>
                  <div className="space-y-3 text-xs text-slate-700">
                    <div>
                      <p className="text-slate-400 font-semibold mb-0.5">이름/부서</p>
                      <p className="font-bold text-slate-900 text-sm">{agent.creatorName} / {agent.creatorDept}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-0.5">연락처 / 메신저</p>
                      <p className="font-mono text-slate-800 break-all">{agent.creatorContact}</p>
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
            </div>
          )}

          {/* 2. Tab Content: Key Functions */}
          {activeTab === 'features' && (
            <div className="space-y-6 animate-fade-in" id="tab-features">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">🔍 주요 구현 기능 리스트</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Mock System Screenshot Placeholder */}
              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">h_agent_visualization_panel.log</span>
                  </div>
                  <span className="text-[10px] text-blue-300 font-mono font-bold">ACTIVE (PREVIEW)</span>
                </div>
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="p-3 bg-blue-950/40 rounded-full border border-blue-900/40 text-blue-300 animate-pulse">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h5 className="text-sm font-bold text-white">현업 UI 캡처 및 아키텍처 다이어그램</h5>
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    본 에이전트는 사내 RPA 솔루션 또는 사내 챗봇 연동 모듈을 통해 현대코퍼레이션 클라우드 환경에서 안전하게 연산되고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Tab Content: How to Use */}
          {activeTab === 'guide' && (
            <div className="space-y-6 animate-fade-in" id="tab-guide">
              <h4 className="text-sm font-bold text-slate-900 mb-4">📖 Step-by-Step 실무 적용 사용 가이드</h4>
              <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {agent.steps.map((step, idx) => (
                  <div key={idx} className="relative space-y-1.5">
                    {/* Floating number bullet */}
                    <div className="absolute -left-9 top-0 h-6 w-6 rounded-full bg-hyundai-blue text-white border-2 border-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </div>
                    <h5 className="text-sm font-bold text-slate-900">Step {idx + 1}</h5>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Tab Content: Code / Prompt Share */}
          {activeTab === 'prompt' && (
            <div className="space-y-4 animate-fade-in" id="tab-prompt">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Code className="h-4 w-4 text-hyundai-blue" />
                  <span>핵심 구현 소스 코드 (Core Logic Code)</span>
                </h4>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors border border-slate-200"
                  id="btn-copy-prompt"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-600">복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>코드 복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 max-h-96 overflow-y-auto shadow-inner">
                <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
                  {agent.prompt}
                </pre>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                💡 구현된 백엔드 또는 비즈니스 연산 소스 코드를 복사하여 사내 시스템 연동 및 분석용 스크립트로 즉시 활용할 수 있습니다.
              </p>
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
                  currentUser && agent.likedBy.includes(currentUser.employeeId)
                    ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
                id="btn-detail-like"
              >
                <ThumbsUp className={`h-3.5 w-3.5 ${currentUser && agent.likedBy.includes(currentUser.employeeId) ? 'fill-rose-500 text-rose-600' : ''}`} />
                <span>도움돼요 ({agent.likes})</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-hyundai-blue" />
              <span>동료 의견 및 활용 후기 ({comments.length})</span>
            </h4>

            {/* Comment Form */}
            {currentUser ? (
              <form onSubmit={handleSendComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="질문, 개선 방안, 혹은 타 부서 응용 아이디어를 공유해 주세요."
                  className="flex-grow text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hyundai-blue focus:border-hyundai-blue bg-white"
                  id="comment-input-field"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-hyundai-blue hover:bg-hyundai-blue/90 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  id="btn-comment-submit"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>등록</span>
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 text-center text-xs text-slate-500 border border-slate-200">
                📢 댓글을 남기거나 좋아요/이모지 공감을 표시하려면 상단의 <strong>사원 로그인</strong>이 필요합니다.
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2" id="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                        <span>{comment.authorName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({comment.authorDept})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400">아직 등록된 활용 제안이 없습니다. 첫 번째 후기를 등록해 보세요!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
