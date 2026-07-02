import React from 'react';
import { Agent } from '../types';
import { Trophy, ArrowRight, Eye, ThumbsUp, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/mockData';

interface BannerProps {
  featuredAgent: Agent | null;
  onSelectAgent: (agentId: string) => void;
}

export default function Banner({ featuredAgent, onSelectAgent }: BannerProps) {
  if (!featuredAgent) return null;

  const categoryInfo = CATEGORY_COLORS[featuredAgent.category] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-r from-hyundai-navy via-hyundai-blue to-hyundai-navy rounded-2xl shadow-xl text-white border border-hyundai-blue/30 p-6 md:p-8 mb-8"
      id="featured-banner"
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left column: Text content */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            <Trophy className="h-3.5 w-3.5 animate-bounce" />
            <span>이달의 우수 Agent (Best Practice)</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              {featuredAgent.name}
            </h2>
            <p className="text-slate-100 text-xs md:text-sm leading-relaxed opacity-90">
              {featuredAgent.shortDesc}
            </p>
          </div>

          {/* Quick Stats & Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm pt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${categoryInfo.bg} ${categoryInfo.text} ${categoryInfo.border} shadow-sm`}>
              {CATEGORY_LABELS[featuredAgent.category]}
            </span>
            <span className="text-slate-200 text-xs">
              제작: <strong className="text-white font-bold">{featuredAgent.creatorName}</strong> ({featuredAgent.creatorDept})
            </span>
            <span className="h-3 w-px bg-white/20 hidden sm:block"></span>
            <div className="flex items-center space-x-3 text-slate-200 text-xs">
              <span className="flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1 text-slate-300" />
                {featuredAgent.views}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-3.5 w-3.5 mr-1 text-slate-300" />
                {featuredAgent.likes}
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Action call card */}
        <div className="w-full md:w-auto flex-shrink-0">
          <div className="bg-slate-950/40 backdrop-blur-md border border-white/10 p-5 rounded-xl text-center md:text-left md:min-w-64 space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-blue-300 font-extrabold block">기대 효과</span>
              <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                📢 {featuredAgent.expectation.split(',')[0]}
              </p>
            </div>
            
            <button
              onClick={() => onSelectAgent(featuredAgent.id)}
              className="w-full flex items-center justify-center space-x-2 bg-hyundai-blue hover:bg-hyundai-blue/90 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:translate-y-[-1px] group"
              id="banner-btn-view"
            >
              <span>에이전트 상세보기</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
