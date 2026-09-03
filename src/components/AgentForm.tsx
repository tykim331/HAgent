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
  const [category, setCategory] = useState<CategoryType>('data_collection');
  const [shortDesc, setShortDesc] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [expectation, setExpectation] = useState('');
  
  // Dynamic lists for features and steps
  const [features, setFeatures] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  
  const [prompt, setPrompt] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorRank, setCreatorRank] = useState('');
  const [creatorDept, setCreatorDept] = useState('');
  const [creatorContact, setCreatorContact] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [screenUrls, setScreenUrls] = useState<string[]>([]);
  const [password, setPassword] = useState('');

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
      setCreatorRank(editingAgent.creatorRank || '');
      setCreatorDept(editingAgent.creatorDept);
      setCreatorContact(editingAgent.creatorContact);
      setThumbnailUrl(editingAgent.thumbnailUrl || '');
      setScreenUrls(editingAgent.screenUrls || []);
      setPassword(editingAgent.password || '');
    } else if (currentUser) {
      // Auto fill creator info from logged-in user
      setCreatorName(currentUser.name);
      setCreatorRank('');
      setCreatorDept(currentUser.department);
      setCreatorContact(`${currentUser.name.toLowerCase()}@hyundaicorp.com / 사내 메신저: ${currentUser.name.toLowerCase()}`);
      setPassword('');
    }
  }, [editingAgent, currentUser]);

  const handleAddFeature = () => {
    if (features.length < 10) setFeatures([...features, '']);
  };
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

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScreenUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map((file: any) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(urls => {
        setScreenUrls(prev => [...prev, ...urls]);
      });
    }
  };

  const removeScreenUrl = (index: number) => {
    setScreenUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDesc.trim()) return;

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
      creatorRank,
      creatorDept,
      creatorContact,
      thumbnailUrl,
      screenUrls,
      password
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in" id="agent-form-container">
      {/* Form Header */}
      <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-hyundai-blue" />
            <span>{editingAgent ? '업무용 AI Agent 정보 수정' : '신규 AI Agent 등록'}</span>
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-900">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="font-bold">비로그인 등록 안내</h5>
            <p>등록하신 에이전트를 나중에 <strong>수정하기 위해서는 비밀번호(4자리)를 설정</strong>해야 합니다.</p>
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
              <span>첨부 파일 (선택)</span>
            </h3>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">매칭 대표 이미지 (썸네일, 1개)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleThumbnailUpload} 
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              />
              {thumbnailUrl && (
                <div className="relative rounded-lg overflow-hidden h-24 border border-slate-200 mt-2">
                  <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Screen Uploads */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Agent 화면 (다중 선택 가능)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleScreenUpload} 
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              />
              {screenUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {screenUrls.map((url, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden h-20 border border-slate-200 group">
                      <img src={url} alt={`Screen ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeScreenUrl(idx)}
                        className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic List Section: Features */}
        <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-200">
          
          {/* Major Features */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">🛠️ 주요 구현 기능 리스트 (최대 10개)</label>
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
        </div>

        {/* Creator Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
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
            <label className="text-xs font-bold text-slate-600">직급</label>
            <input
              type="text"
              required
              value={creatorRank}
              onChange={(e) => setCreatorRank(e.target.value)}
              placeholder="예: 프로"
              className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              id="form-input-creatorrank"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">소속 부서</label>
            <input
              type="text"
              required
              value={creatorDept}
              onChange={(e) => setCreatorDept(e.target.value)}
              placeholder="예: 인재개발팀"
              className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              id="form-input-creatordept"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">연락처 / 이메일</label>
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

        {!currentUser && !editingAgent && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 w-full md:w-1/3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">수정용 비밀번호 (4자리 숫자)</label>
              <input
                type="password"
                required
                maxLength={4}
                pattern="\d{4}"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                placeholder="예: 1234"
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                id="form-input-password"
              />
            </div>
          </div>
        )}

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
