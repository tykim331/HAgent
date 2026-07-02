import React, { useState } from 'react';
import { Agent, Comment } from '../types';
import { Trophy, ThumbsUp, Eye, Medal, Star, Flame, Award, Building2 } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/mockData';

interface LeaderboardProps {
  agents: Agent[];
  comments: Comment[];
  onSelectAgent: (agentId: string) => void;
}

export default function Leaderboard({ agents, comments, onSelectAgent }: LeaderboardProps) {
  const [rankingMetric, setRankingMetric] = useState<'overall' | 'likes' | 'views'>('overall');

  // Helper to calculate total score for Overall sorting
  const getAgentScore = (agent: Agent) => {
    const agentCommentsCount = comments.filter(c => c.agentId === agent.id).length;
    const totalReactionsCount = Object.values(agent.emojiReactions).reduce((sum, list) => sum + list.length, 0);
    
    // Custom Weight: Likes=10pts, Reactions=5pts, Comments=8pts, Views=1pt
    return (agent.likes * 10) + (totalReactionsCount * 5) + (agentCommentsCount * 8) + agent.views;
  };

  // Sort and slice Top 10 Agents
  const sortedAgents = [...agents].sort((a, b) => {
    if (rankingMetric === 'likes') {
      return b.likes - a.likes;
    }
    if (rankingMetric === 'views') {
      return b.views - a.views;
    }
    return getAgentScore(b) - getAgentScore(a);
  }).slice(0, 10);

  // Department Aggregated Statistics
  const departmentStats = agents.reduce((acc, agent) => {
    const dept = agent.creatorDept.split(' ')[0] || '기타';
    if (!acc[dept]) {
      acc[dept] = { count: 0, likes: 0, views: 0 };
    }
    acc[dept].count += 1;
    acc[dept].likes += agent.likes;
    acc[dept].views += agent.views;
    return acc;
  }, {} as Record<string, { count: number; likes: number; views: number }>);

  const sortedDepts = Object.entries(departmentStats)
    .sort((a, b) => b[1].likes - a[1].likes)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in" id="leaderboard-container">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-hyundai-navy to-slate-950 rounded-2xl p-6 text-white border border-hyundai-blue/20 flex items-center justify-between shadow-lg">
        <div className="space-y-1.5 max-w-xl">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <span>AI Agent 명예의 전당 (Top 10)</span>
          </h2>
          <p className="text-xs text-blue-200 leading-relaxed">
            임직원 추천수, 실시간 구동 테스트 횟수, 피드백 참여도를 기반으로 선정한 최우수 10개 AI 에이전트와 우수 혁신 부서를 공개합니다.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-xl text-center">
            <span className="text-[10px] text-yellow-400 uppercase tracking-wider font-extrabold block">BOOTCAMP BEST</span>
            <p className="text-2xl font-black text-yellow-300">BUILD</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Rankers, Right Dept stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Top 10 List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
            <h3 className="text-base font-bold text-slate-900">🏆 실시간 에이전트 랭킹</h3>
            
            {/* Sorting Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold" id="ranking-tabs">
              <button
                onClick={() => setRankingMetric('overall')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  rankingMetric === 'overall' ? 'bg-white shadow text-hyundai-blue' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                종합 지수 순
              </button>
              <button
                onClick={() => setRankingMetric('likes')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  rankingMetric === 'likes' ? 'bg-white shadow text-hyundai-blue' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                최다 추천순
              </button>
              <button
                onClick={() => setRankingMetric('views')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  rankingMetric === 'views' ? 'bg-white shadow text-hyundai-blue' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                최다 조회순
              </button>
            </div>
          </div>

          {/* Ranking list items */}
          <div className="space-y-3" id="leaderboard-list">
            {sortedAgents.map((agent, index) => {
              const score = getAgentScore(agent);
              const isMedal = index < 3;
              
              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  className="bg-white border border-slate-200 hover:border-hyundai-blue p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:translate-x-1 shadow-sm group"
                  id={`leaderboard-item-${index + 1}`}
                >
                  <div className="flex items-center space-x-4 min-w-0 flex-grow pr-4">
                    {/* Position Badge */}
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      {index === 0 ? (
                        <Medal className="h-7 w-7 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="h-7 w-7 text-slate-400" />
                      ) : index === 2 ? (
                        <Medal className="h-7 w-7 text-amber-600" />
                      ) : (
                        <span className="text-sm font-bold text-slate-400 font-mono">#{index + 1}</span>
                      )}
                    </div>

                    {/* Agent details */}
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-hyundai-blue transition-colors line-clamp-1 leading-snug">
                        {agent.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{agent.creatorName} ({agent.creatorDept.split(' ')[0]})</span>
                        <span className="h-2 w-px bg-slate-300"></span>
                        <span className="text-hyundai-blue font-bold bg-blue-50/70 border border-blue-100/30 px-1.5 py-0.5 rounded-sm">{CATEGORY_LABELS[agent.category]}</span>
                      </p>
                    </div>
                  </div>

                  {/* Score indicators */}
                  <div className="flex-shrink-0 flex items-center space-x-6 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center text-rose-500">
                      <ThumbsUp className="h-3.5 w-3.5 mr-1 fill-rose-50" />
                      {agent.likes}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      {agent.views}
                    </span>
                    {rankingMetric === 'overall' && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-normal">종합 점수</span>
                        <span className="text-xs font-black text-slate-800 font-mono">{score}점</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Corporate Department Rankings */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-hyundai-blue" />
              <span>우수 혁신 부서 랭킹 (Top 5)</span>
            </h3>

            <div className="space-y-4" id="department-ranking-board">
              {sortedDepts.map(([deptName, stat], idx) => {
                const maxLikes = Math.max(...sortedDepts.map(d => d[1].likes));
                const barPercent = Math.max(10, Math.round((stat.likes / maxLikes) * 100));

                return (
                  <div key={deptName} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <span className="text-slate-400 font-mono font-bold">#{idx + 1}</span>
                        <span>{deptName}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        추천 <strong>{stat.likes}</strong> (등록 {stat.count}개)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-hyundai-blue rounded-full transition-all duration-500" 
                        style={{ width: `${barPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed pt-2">
              💡 부서 랭킹은 소속 직원들이 등록한 에이전트의 총 누적 추천수(Likes)를 가산하여 매주 월요일 오전 자동 업데이트됩니다.
            </p>
          </div>

          {/* Gamification Call to Action Card */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-xl p-5 text-center space-y-3">
            <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center text-hyundai-blue">
              <Flame className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">당신의 혁신 워크플로우를 등록하세요!</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                업무에서 반복적으로 사용하는 프롬프트 지침이 있나요? 간단히 등록하여 부서 랭킹을 올리고 우수 포상을 수여 받으세요!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
