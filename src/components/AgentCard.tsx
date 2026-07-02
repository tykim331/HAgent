import React from 'react';
import { Agent } from '../types';
import { ThumbsUp, Eye } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/mockData';

interface AgentCardProps {
  key?: string;
  agent: Agent;
  onSelect: (agentId: string) => void;
}

export default function AgentCard({ agent, onSelect }: AgentCardProps) {
  const categoryInfo = CATEGORY_COLORS[agent.category] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  // Format Date safely
  const formattedDate = new Date(agent.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Count total emoji reactions
  const totalReactions = Object.values(agent.emojiReactions).reduce(
    (acc, employeeIds) => acc + employeeIds.length,
    0
  );

  return (
    <div 
      onClick={() => onSelect(agent.id)}
      className="bg-white rounded-xl overflow-hidden border border-hyundai-border shadow-sm card-hover-effect cursor-pointer flex flex-col group h-full"
      id={`agent-card-${agent.id}`}
    >
      {/* Thumbnail Container */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={agent.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400'}
          alt={agent.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

        {/* Badges on Thumbnail */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ${categoryInfo.bg} ${categoryInfo.text} ${categoryInfo.border}`}>
            {CATEGORY_LABELS[agent.category]}
          </span>
        </div>

        {/* Date on bottom right */}
        <span className="absolute bottom-3 right-3 text-[10px] text-slate-200 bg-slate-900/40 px-2 py-0.5 rounded-md font-bold">
          {formattedDate}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-hyundai-blue transition-colors">
            {agent.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">
            {agent.shortDesc}
          </p>
        </div>

        {/* Author / Creator info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6.5 w-6.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200 shadow-inner">
              {agent.creatorName.slice(0, 1)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">
                {agent.creatorName}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none font-medium">
                {agent.creatorDept.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-bold">
            <span className="flex items-center" title="조회수">
              <Eye className="h-3.5 w-3.5 mr-0.5 text-slate-300" />
              {agent.views}
            </span>
            <span className="flex items-center text-rose-500" title="좋아요">
              <ThumbsUp className="h-3.5 w-3.5 mr-0.5 fill-rose-50 text-rose-400" />
              {agent.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
