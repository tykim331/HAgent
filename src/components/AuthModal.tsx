import React, { useState } from 'react';
import { User } from '../types';
import { X, LogIn, Sparkles, Building2, UserCircle, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const PRESET_USERS: User[] = [
  { employeeId: 'emp-777', name: '이민규', department: '인재개발팀 (HR)', role: 'admin' },
  { employeeId: 'emp-102', name: '김동욱', department: '철강수출본부', role: 'user' },
  { employeeId: 'emp-103', name: '박정아', department: '화학영업기획부', role: 'user' },
  { employeeId: 'emp-104', name: '최현우', department: '기계에너지사업부', role: 'user' }
];

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('철강수출1팀');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim() || !name.trim()) return;

    onLoginSuccess({
      employeeId: employeeId.trim(),
      name: name.trim(),
      department: department.trim(),
      role: isAdmin ? 'admin' : 'user'
    });
  };

  const handleSelectPreset = (user: User) => {
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="auth-modal-backdrop">
      <div 
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        id="auth-modal"
      >
        {/* Header */}
        <div className="bg-hyundai-navy text-white p-5 flex justify-between items-center border-b border-slate-800">
          <div className="space-y-0.5">
            <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
              <LogIn className="h-4.5 w-4.5 text-hyundai-blue" />
              <span>현대코퍼레이션그룹 통합 로그인 (Mock)</span>
            </h3>
            <p className="text-[11px] text-slate-400">사내 갤러리 활용 및 평가를 위해 임직원 인증이 필요합니다.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            id="auth-close-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Preset Accounts */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">🏢 테스트용 사내 계정 선택 (간편 로그인)</label>
            <div className="grid grid-cols-2 gap-2" id="preset-login-grid">
              {PRESET_USERS.map((user) => (
                <button
                   key={user.employeeId}
                   onClick={() => handleSelectPreset(user)}
                   className={`p-2.5 text-left rounded-xl border text-xs font-bold flex flex-col justify-between hover:border-hyundai-blue hover:bg-blue-50/10 transition-all ${
                     user.role === 'admin' ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200 bg-slate-50/50'
                   }`}
                   id={`preset-login-${user.employeeId}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-slate-900">{user.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.25 rounded-md font-bold uppercase ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {user.role === 'admin' ? '인재개발팀' : '현업'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block font-bold leading-none">{user.department}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400">또는 직접 정보 입력</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="custom-auth-form">
            {/* Employee ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">사번 (Employee ID)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserCircle className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="예: emp-123 (숫자/문자 무관)"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-hyundai-blue bg-slate-50/30"
                  id="auth-input-empid"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">이름 (Full Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-hyundai-blue bg-slate-50/30"
                id="auth-input-name"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">소속 부서 (Department)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Building2 className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="예: 철강영업기획팀"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-hyundai-blue bg-slate-50/30"
                  id="auth-input-dept"
                />
              </div>
            </div>

            {/* Role switch */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">관리자(인재개발팀) 권한 로그인</span>
                <span className="text-[10px] text-slate-400">우수 Agent 평가 배지 부여 기능이 제공됩니다.</span>
              </div>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 text-hyundai-blue border-slate-300 rounded focus:ring-hyundai-blue"
                id="auth-checkbox-admin"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!employeeId.trim() || !name.trim()}
              className="w-full py-2.5 bg-hyundai-blue hover:bg-hyundai-blue/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md"
              id="btn-auth-submit"
            >
              <span>입사 및 로그인 승인</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
