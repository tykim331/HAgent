import React from 'react';
import { User } from '../types';
import { LayoutGrid, PlusCircle, Trophy, UserCheck, LogIn, LogOut, Cpu, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: 'gallery' | 'register' | 'leaderboard' | 'mypage';
  setActiveTab: (tab: 'gallery' | 'register' | 'leaderboard' | 'mypage') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout
}: HeaderProps) {
  return (
    <header className="bg-hyundai-navy text-white shadow-lg border-b border-hyundai-blue/30" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setActiveTab('gallery')}
            id="brand-logo"
          >
            <div className="p-2 bg-hyundai-blue rounded-lg flex items-center justify-center shadow-inner">
              <Cpu className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                현대코퍼레이션그룹 AI Agent 학습 플랫폼
              </h1>
              <p className="text-[10px] text-slate-300 hidden sm:block font-medium tracking-wide">AI 학습 가이드부터 직접 만든 AI Agent들을 한눈에 볼 수 있는 AI를 배우고, 만들고, 공유하는 공간</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1" id="desktop-nav">
            <a
              href="https://kihyeonkwon.notion.site/AI-Agent-39fc3ce583dd81558262f6b72d4bd80c"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 bg-hyundai-blue text-white shadow-md hover:bg-blue-700"
            >
              <BookOpen className="mr-1.5 h-4 w-4" />
              바이브코딩 학습자료
            </a>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                activeTab === 'gallery'
                  ? 'bg-hyundai-blue text-white shadow-md ring-2 ring-white/20'
                  : 'bg-hyundai-blue/80 text-white shadow-md hover:bg-hyundai-blue'
              }`}
              id="nav-gallery"
            >
              <LayoutGrid className="mr-1.5 h-4 w-4" />
              에이전트 갤러리
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-hyundai-blue text-white shadow-md ring-2 ring-white/20'
                  : 'bg-hyundai-blue/80 text-white shadow-md hover:bg-hyundai-blue'
              }`}
              id="nav-register"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              에이전트 등록
            </button>
          </nav>
 
          {/* User Auth Section */}
          <div className="flex items-center space-x-3" id="auth-actions">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] text-slate-300 font-medium">{currentUser.department}</p>
                  <p className="text-xs font-bold text-white">
                    {currentUser.name} 
                    <span className="text-[10px] text-slate-300 ml-1 font-normal">({currentUser.role === 'admin' ? '관리자' : '임직원'})</span>
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-hyundai-blue flex items-center justify-center text-white font-bold text-xs shadow-inner uppercase border border-white/20">
                  {currentUser.name.slice(0, 2)}
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-md text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  title="로그아웃"
                  id="btn-logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex justify-around items-center border-t border-hyundai-blue/20 py-2.5 bg-hyundai-navy/95 backdrop-blur" id="mobile-nav">
        <a
          href="https://kihyeonkwon.notion.site/AI-Agent-39fc3ce583dd81558262f6b72d4bd80c"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-[10px] transition-colors text-blue-300 font-extrabold"
        >
          <BookOpen className="h-5 w-5 mb-0.5" />
          학습자료
        </a>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex flex-col items-center text-[10px] transition-colors ${
            activeTab === 'gallery' ? 'text-blue-300 font-extrabold scale-110' : 'text-blue-300/80 font-bold hover:text-blue-300'
          }`}
          id="mobile-nav-gallery"
        >
          <LayoutGrid className="h-5 w-5 mb-0.5" />
          갤러리
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex flex-col items-center text-[10px] transition-colors ${
            activeTab === 'register' ? 'text-blue-300 font-extrabold scale-110' : 'text-blue-300/80 font-bold hover:text-blue-300'
          }`}
          id="mobile-nav-register"
        >
          <PlusCircle className="h-5 w-5 mb-0.5" />
          등록
        </button>
      </div>
    </header>
  );
}
