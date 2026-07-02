import React, { useState, useEffect } from 'react';
import { Agent, CategoryType, User } from '../types';
import { 
  X, Plus, Trash2, HelpCircle, Save, Info, Sparkles, Terminal, BookOpen, AlertCircle, Code 
} from 'lucide-react';
import { CATEGORY_LABELS } from '../data/mockData';

interface AgentFormProps {
  currentUser: User | null;
  onSubmit: (agentData: Partial<Agent>) => void;
  onCancel: () => void;
  editingAgent?: Agent | null;
}

// Curated stock illustrations for professional corporate thumbnail selections
const THUMBNAIL_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=400', label: '물류/글로벌 컨테이너' },
  { url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400', label: '법률/계약서 분석' },
  { url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400', label: '경제/지수 대시보드' },
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400', label: '제조/기계설비 엔지니어링' },
  { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=400', label: '광물/에너지 트레이딩' },
  { url: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=400', label: '글로벌 바이어 상담/회의' }
];

export default function AgentForm({
  currentUser,
  onSubmit,
  onCancel,
  editingAgent
}: AgentFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('report');
  const [shortDesc, setShortDesc] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [expectation, setExpectation] = useState('');
  
  // Dynamic lists for features and steps
  const [features, setFeatures] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  
  const [prompt, setPrompt] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorDept, setCreatorDept] = useState('');
  const [creatorContact, setCreatorContact] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(THUMBNAIL_PRESETS[0].url);

  // Load editing values if preset
  useEffect(() => {
    if (editingAgent) {
      setName(editingAgent.name);
      setCategory(editingAgent.category);
      setShortDesc(editingAgent.shortDesc);
      setPainPoint(editingAgent.painPoint);
      setExpectation(editingAgent.expectation);
      setFeatures(editingAgent.features.length > 0 ? editingAgent.features : ['']);
      setSteps(editingAgent.steps.length > 0 ? editingAgent.steps : ['']);
      setPrompt(editingAgent.prompt);
      setCreatorName(editingAgent.creatorName);
      setCreatorDept(editingAgent.creatorDept);
      setCreatorContact(editingAgent.creatorContact);
      setThumbnailUrl(editingAgent.thumbnailUrl || THUMBNAIL_PRESETS[0].url);
    } else if (currentUser) {
      // Auto fill creator info from logged-in user
      setCreatorName(currentUser.name);
      setCreatorDept(currentUser.department);
      setCreatorContact(`${currentUser.name.toLowerCase()}@hyundaicorp.com / 사내 메신저: ${currentUser.name.toLowerCase()}`);
    }
  }, [editingAgent, currentUser]);

  const handleAddFeature = () => setFeatures([...features, '']);
  const handleRemoveFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated.length > 0 ? updated : ['']);
  };
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleAddStep = () => setSteps([...steps, '']);
  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated.length > 0 ? updated : ['']);
  };
  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDesc.trim() || !prompt.trim()) return;

    // Filter out empty items
    const filteredFeatures = features.filter(f => f.trim() !== '');
    const filteredSteps = steps.filter(s => s.trim() !== '');

    onSubmit({
      name,
      category,
      shortDesc,
      painPoint,
      expectation,
      features: filteredFeatures.length > 0 ? filteredFeatures : ['주요 기능 설명이 작성되지 않았습니다.'],
      steps: filteredSteps.length > 0 ? filteredSteps : ['사용 방법 가이드가 작성되지 않았습니다.'],
      prompt,
      creatorName,
      creatorDept,
      creatorContact,
      thumbnailUrl
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in" id="agent-form-container">
      {/* Form Header */}
      <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-hyundai-blue" />
            <span>{editingAgent ? '업무용 AI Agent 정보 수정' : '신규 업무용 AI Agent 등록'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">부트캠프 수료 결과물 또는 현업에서 유용하게 사용하는 에이전트 스펙을 입력해 주세요.</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          id="form-close-btn"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="font-bold">비로그인 등록 경고</h5>
            <p>현재 로그인되어 있지 않습니다. 등록 시 임의의 임직원 정보로 가입되며, 등록 이후 수정하기 어려울 수 있습니다. 상단에서 로그인을 먼저 하는 것을 추천합니다.</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6" id="agent-registration-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic Information */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-hyundai-blue" />
              <span>기본 정보</span>
            </h3>

            {/* Agent Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Agent 명칭</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 철강재 해외 선복량 예측 에이전트"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-hyundai-blue"
                id="form-input-name"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-hyundai-blue"
                id="form-select-category"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">한 줄 소개</label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="예: 글로벌 선적 동향 데이터를 파싱해 남은 선복 성공률을 실시간 도출합니다."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-hyundai-blue"
                id="form-input-shortdesc"
              />
            </div>

            {/* Pain Point */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">해결하고자 하는 업무 Pain Point</label>
              <textarea
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                placeholder="예: 매번 선박 확보율이 유동적이라 납기 준수가 지연되고, 과도한 운임 견적에 합의해 비용이 초과됨."
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-hyundai-blue"
                id="form-textarea-painpoint"
              />
            </div>

            {/* Expected Effect */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">기대 효과 및 영업/업무 목표</label>
              <textarea
                value={expectation}
                onChange={(e) => setExpectation(e.target.value)}
                placeholder="예: 분기별 물류 정산 지연 20% 단축, 선복 협상 타결률 평균 15% 상승 기대"
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-hyundai-blue"
                id="form-textarea-expectation"
              />
            </div>
          </div>

          {/* Right Column: Code and Implementation */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <Code className="h-4 w-4 text-hyundai-blue" />
              <span>핵심 지침 및 구현 소스 코드</span>
            </h3>

            {/* System Prompt / Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">구현 소스 코드 및 알고리즘 스크립트</label>
                <span className="text-[10px] text-slate-400 font-medium">코드 서식 지원</span>
              </div>
              <textarea
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="import os&#10;from google import genai&#10;...&#10;def run_agent_engine(data):&#10;    # 에이전트 핵심 구현 코드를 입력하세요"
                rows={9}
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hyundai-blue font-mono leading-relaxed bg-slate-50"
                id="form-textarea-prompt"
              />
            </div>

            {/* Thumbnail presets selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">매칭 대표 이미지 (썸네일)</label>
              <div className="grid grid-cols-3 gap-2">
                {THUMBNAIL_PRESETS.map((preset, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setThumbnailUrl(preset.url)}
                    className={`relative rounded-lg overflow-hidden h-14 border-2 cursor-pointer transition-all ${
                      thumbnailUrl === preset.url ? 'border-hyundai-blue scale-95 shadow-sm' : 'border-slate-200'
                    }`}
                    title={preset.label}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-slate-900/10 hover:bg-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic List Section: Features & Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          
          {/* Major Features */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">🛠️ 구현 기능 리스트 (최대 4개)</label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center space-x-1 text-xs text-hyundai-blue hover:underline font-bold"
                id="form-btn-add-feature"
              >
                <Plus className="h-3 w-3" />
                <span>추가</span>
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs text-slate-400 font-semibold w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder="예: 최신 LME 금속 인덱스 자동 요약"
                    className="flex-grow text-xs p-2 border border-slate-300 rounded"
                    id={`form-feature-input-${idx}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">📖 단계별 사용 방법 가이드</label>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center space-x-1 text-xs text-hyundai-blue hover:underline font-bold"
                id="form-btn-add-step"
              >
                <Plus className="h-3 w-3" />
                <span>추가</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs text-slate-400 font-semibold w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    placeholder="예: 바이어 견적 사양서를 이메일에서 복사하여 본문에 넣습니다."
                    className="flex-grow text-xs p-2 border border-slate-300 rounded"
                    id={`form-step-input-${idx}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">제작자명 (실명)</label>
            <input
              type="text"
              required
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              id="form-input-creatorname"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">소속 부서</label>
            <input
              type="text"
              required
              value={creatorDept}
              onChange={(e) => setCreatorDept(e.target.value)}
              placeholder="예: 철강3팀"
              className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              id="form-input-creatordept"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">연락처 / 사내 메신저</label>
            <input
              type="text"
              required
              value={creatorContact}
              onChange={(e) => setCreatorContact(e.target.value)}
              placeholder="예: gd.hong@hyundaicorp.com"
              className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              id="form-input-creatorcontact"
            />
          </div>
        </div>

        {/* Actions Submit / Cancel */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
            id="btn-form-cancel"
          >
            취소 및 돌아가기
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-hyundai-blue hover:bg-hyundai-blue/90 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md"
            id="btn-form-submit"
          >
            <Save className="h-4 w-4" />
            <span>{editingAgent ? '수정 완료 및 업로드' : '에이전트 허브에 공유하기'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
