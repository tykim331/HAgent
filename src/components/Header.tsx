import React from 'react';
import { User } from '../types';
import { LayoutGrid, PlusCircle, Trophy, UserCheck, LogIn, LogOut, Cpu } from 'lucide-react';

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
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                H-Agent <span className="text-blue-300 font-bold text-xs px-2 py-0.5 bg-white/10 border border-white/15 rounded">Hub</span>
              </h1>
              <p className="text-[10px] text-slate-300 hidden sm:block font-medium tracking-wide">현대코퍼레이션그룹 AI Agent 공유 플랫폼</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1" id="desktop-nav">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                activeTab === 'gallery'
                  ? 'bg-hyundai-blue text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
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
                  ? 'bg-hyundai-blue text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              id="nav-register"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              에이전트 등록
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                activeTab === 'leaderboard'
                  ? 'bg-hyundai-blue text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              id="nav-leaderboard"
            >
              <Trophy className="mr-1.5 h-4 w-4" />
              명예의 전당 (Top 10)
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
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex flex-col items-center text-[10px] transition-colors ${
            activeTab === 'gallery' ? 'text-blue-300 font-extrabold' : 'text-slate-300/80'
          }`}
          id="mobile-nav-gallery"
        >
          <LayoutGrid className="h-5 w-5 mb-0.5" />
          갤러리
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex flex-col items-center text-[10px] transition-colors ${
            activeTab === 'register' ? 'text-blue-300 font-extrabold' : 'text-slate-300/80'
          }`}
          id="mobile-nav-register"
        >
          <PlusCircle className="h-5 w-5 mb-0.5" />
          등록
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center text-[10px] transition-colors ${
            activeTab === 'leaderboard' ? 'text-blue-300 font-extrabold' : 'text-slate-300/80'
          }`}
          id="mobile-nav-leaderboard"
        >
          <Trophy className="h-5 w-5 mb-0.5" />
          명예의 전당
        </button>

      </div>
    </header>
  );
}
