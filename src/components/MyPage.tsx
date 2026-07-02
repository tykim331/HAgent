import React from 'react';
import { Agent, Comment, User } from '../types';
import { 
  FolderCheck, ThumbsUp, Eye, MessageSquare, Edit3, Trash2, 
  LogIn, UserCheck, ChevronRight, BarChart3, TrendingUp 
} from 'lucide-react';

interface MyPageProps {
  currentUser: User | null;
  agents: Agent[];
  comments: Comment[];
  onSelectAgent: (agentId: string) => void;
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agentId: string) => void;
  onOpenLogin: () => void;
}

export default function MyPage({
  currentUser,
  agents,
  comments,
  onSelectAgent,
  onEditAgent,
  onDeleteAgent,
  onOpenLogin
}: MyPageProps) {
  
  if (!currentUser) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto text-center space-y-5 shadow-lg my-12 animate-fade-in" id="mypage-unauthenticated">
        <div className="h-12 w-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto text-hyundai-blue shadow-inner">
          <UserCheck className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">마이페이지 입장을 위한 로그인</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            H-Agent Hub의 마이페이지 기능은 등록자 전용 서비스입니다. 간단한 사번과 이름 입력으로 즉시 대시보드를 활성화할 수 있습니다.
          </p>
        </div>
        <button
          onClick={onOpenLogin}
          className="w-full py-2.5 bg-hyundai-blue hover:bg-hyundai-blue/90 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm"
          id="mypage-btn-login-trigger"
        >
          <LogIn className="h-4.5 w-4.5" />
          <span>사원 로그인하기</span>
        </button>
      </div>
    );
  }

  // Filter agents made by the logged-in user
  const myAgents = agents.filter(
    (agent) => agent.creatorName === currentUser.name || agent.likedBy.includes(currentUser.employeeId)
  );
  
  // Actually authored agents
  const authoredAgents = agents.filter(
    (agent) => agent.creatorName === currentUser.name
  );

  // Statistics calculations
  const totalAuthored = authoredAgents.length;
  const totalViews = authoredAgents.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = authoredAgents.reduce((sum, a) => sum + a.likes, 0);
  
  const myAgentIds = authoredAgents.map(a => a.id);
  const totalComments = comments.filter(c => myAgentIds.includes(c.agentId)).length;

  return (
    <div className="space-y-8 animate-fade-in" id="mypage-container">
      {/* Profile summary card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-full bg-hyundai-navy text-white font-extrabold text-lg flex items-center justify-center shadow">
            {currentUser.name.slice(0, 2)}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{currentUser.name} {currentUser.role === 'admin' ? '관리자' : '대리'}</h2>
            <p className="text-xs text-slate-500">{currentUser.department} | 사번: {currentUser.employeeId}</p>
          </div>
        </div>
        
        {/* Quick status tags */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold border border-slate-200">
            부트캠프 수료자인증 🏅
          </span>
          {currentUser.role === 'admin' && (
            <span className="text-[11px] bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold border border-red-200">
              전체 시스템 관리자 👑
            </span>
          )}
        </div>
      </div>

      {/* KPI Stats blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="mypage-stats-grid">
        {/* Total creations */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1.5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">내가 제작한 Agent</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900">{totalAuthored}</span>
            <span className="text-xs text-slate-500 font-medium">개</span>
          </div>
          <div className="flex items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
            <FolderCheck className="h-3 w-3 mr-1 text-hyundai-blue" />
            <span>임직원 공유 중</span>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1.5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">누적 조회수</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900">{totalViews}</span>
            <span className="text-xs text-slate-500 font-medium">회</span>
          </div>
          <div className="flex items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
            <Eye className="h-3 w-3 mr-1 text-slate-500" />
            <span>전사 누적 수치</span>
          </div>
        </div>

        {/* Total Likes */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1.5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block font-bold">누적 추천 수</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900">{totalLikes}</span>
            <span className="text-xs text-slate-500 font-medium">회</span>
          </div>
          <div className="flex items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
            <ThumbsUp className="h-3 w-3 mr-1 text-rose-500 fill-rose-50" />
            <span>최우수 랭킹 반영 중</span>
          </div>
        </div>

        {/* Comments Received */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1.5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">동료 피드백 수</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900">{totalComments}</span>
            <span className="text-xs text-slate-500 font-medium">개</span>
          </div>
          <div className="flex items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
            <MessageSquare className="h-3 w-3 mr-1 text-emerald-500" />
            <span>질문 및 개선 요청 포함</span>
          </div>
        </div>
      </div>

      {/* Authored Agents List */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-hyundai-blue" />
          <span>내가 작성한 에이전트 목록 및 관리 ({totalAuthored})</span>
        </h3>

        <div className="space-y-3" id="mypage-authored-list">
          {authoredAgents.length > 0 ? (
            authoredAgents.map((agent) => (
              <div 
                key={agent.id}
                className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div 
                  className="min-w-0 flex-grow cursor-pointer"
                  onClick={() => onSelectAgent(agent.id)}
                  title="상세 사양 보기"
                >
                  <h4 className="text-sm font-bold text-slate-950 hover:text-hyundai-blue transition-colors flex items-center gap-2">
                    <span>{agent.name}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed pr-6">{agent.shortDesc}</p>
                </div>

                {/* Operations buttons */}
                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium pr-3 border-r border-slate-200">
                    <span className="flex items-center"><ThumbsUp className="h-3.5 w-3.5 mr-1" /> {agent.likes}</span>
                    <span className="flex items-center"><Eye className="h-3.5 w-3.5 mr-1" /> {agent.views}</span>
                  </div>
                  
                  {/* Edit/Delete triggers */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditAgent(agent)}
                      className="p-2 text-hyundai-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="수정하기"
                      id={`mypage-edit-${agent.id}`}
                    >
                      <Edit3 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAgent(agent.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="삭제하기"
                      id={`mypage-delete-${agent.id}`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 rounded-xl p-8 text-center border border-dashed border-slate-300 space-y-2">
              <p className="text-xs text-slate-500">아직 직접 등록한 AI 에이전트 목록이 존재하지 않습니다.</p>
              <p className="text-[11px] text-slate-400">부트캠프 수료과정 또는 개인 업무 중 발굴한 AI 자동화 프롬프트를 상단 <strong>'에이전트 등록'</strong>을 클릭해 가장 먼저 등록해 보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
