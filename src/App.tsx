import React, { useState, useEffect } from 'react';
import { Agent, Comment, User, CategoryType } from './types';
import { INITIAL_AGENTS, INITIAL_COMMENTS, CATEGORY_LABELS } from './data/mockData';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import AgentDetail from './components/AgentDetail';
import AgentForm from './components/AgentForm';
import Leaderboard from './components/Leaderboard';
import MyPage from './components/MyPage';
import AuthModal from './components/AuthModal';
import { 
  Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Sparkles, Plus, AlertCircle 
} from 'lucide-react';

export default function App() {
  // --- States ---
  const [agents, setAgents] = useState<Agent[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState<'gallery' | 'register' | 'leaderboard' | 'mypage'>('gallery');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');
  const [sortBy, setSortBy] = useState<'likes' | 'views' | 'newest'>('likes');

  // --- Initialize State from LocalStorage or Fallback ---
  useEffect(() => {
    const savedAgents = localStorage.getItem('H_AGENTS');
    const savedComments = localStorage.getItem('H_COMMENTS');
    const savedUser = localStorage.getItem('H_USER');

    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    } else {
      setAgents(INITIAL_AGENTS);
      localStorage.setItem('H_AGENTS', JSON.stringify(INITIAL_AGENTS));
    }

    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments(INITIAL_COMMENTS);
      localStorage.setItem('H_COMMENTS', JSON.stringify(INITIAL_COMMENTS));
    }

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // --- Handlers ---
  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    
    // Increment view count
    setAgents(prev => {
      const updated = prev.map(a => a.id === agentId ? { ...a, views: a.views + 1 } : a);
      localStorage.setItem('H_AGENTS', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLike = (agentId: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setAgents(prev => {
      const updated = prev.map(a => {
        if (a.id !== agentId) return a;
        
        const isLiked = a.likedBy.includes(currentUser.employeeId);
        const likedBy = isLiked
          ? a.likedBy.filter(id => id !== currentUser.employeeId)
          : [...a.likedBy, currentUser.employeeId];
        
        return {
          ...a,
          likes: isLiked ? a.likes - 1 : a.likes + 1,
          likedBy
        };
      });
      localStorage.setItem('H_AGENTS', JSON.stringify(updated));
      return updated;
    });
  };

  const handleReact = (agentId: string, emoji: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setAgents(prev => {
      const updated = prev.map(a => {
        if (a.id !== agentId) return a;

        const currentReactions = { ...a.emojiReactions };
        const userList = currentReactions[emoji] || [];
        
        const hasReacted = userList.includes(currentUser.employeeId);
        const updatedUserList = hasReacted
          ? userList.filter(id => id !== currentUser.employeeId)
          : [...userList, currentUser.employeeId];

        currentReactions[emoji] = updatedUserList;

        return {
          ...a,
          emojiReactions: currentReactions
        };
      });
      localStorage.setItem('H_AGENTS', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddComment = (agentId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      agentId,
      authorName: currentUser.name,
      authorDept: currentUser.department,
      authorId: currentUser.employeeId,
      content,
      createdAt: new Date().toISOString()
    };

    setComments(prev => {
      const updated = [...prev, newComment];
      localStorage.setItem('H_COMMENTS', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateBadge = (agentId: string, badge: Agent['badge']) => {
    if (currentUser?.role !== 'admin') return;

    setAgents(prev => {
      const updated = prev.map(a => a.id === agentId ? { ...a, badge } : a);
      localStorage.setItem('H_AGENTS', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmitAgent = (agentData: Partial<Agent>) => {
    if (editingAgent) {
      // Edit mode
      setAgents(prev => {
        const updated = prev.map(a => a.id === editingAgent.id ? { ...a, ...agentData } as Agent : a);
        localStorage.setItem('H_AGENTS', JSON.stringify(updated));
        return updated;
      });
      setEditingAgent(null);
    } else {
      // Register mode
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: agentData.name || '무제 에이전트',
        category: agentData.category || 'etc',
        shortDesc: agentData.shortDesc || '',
        painPoint: agentData.painPoint || '',
        expectation: agentData.expectation || '',
        features: agentData.features || [],
        steps: agentData.steps || [],
        prompt: agentData.prompt || '',
        creatorName: agentData.creatorName || currentUser?.name || '익명 임직원',
        creatorDept: agentData.creatorDept || currentUser?.department || '현업 부서',
        creatorContact: agentData.creatorContact || '사내 메신저',
        likes: 0,
        likedBy: [],
        views: 1,
        createdAt: new Date().toISOString(),
        thumbnailUrl: agentData.thumbnailUrl,
        emojiReactions: {
          '👍': [], '🔥': [], '💡': [], '👏': [], '❤️': [], '👀': []
        }
      };

      setAgents(prev => {
        const updated = [newAgent, ...prev];
        localStorage.setItem('H_AGENTS', JSON.stringify(updated));
        return updated;
      });
    }

    setActiveTab('gallery');
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setActiveTab('register');
  };

  const handleDeleteAgent = (agentId: string) => {
    const isConfirmed = window.confirm("이 AI 에이전트를 공유 허브에서 정말로 제거하시겠습니까?");
    if (!isConfirmed) return;

    setAgents(prev => {
      const updated = prev.filter(a => a.id !== agentId);
      localStorage.setItem('H_AGENTS', JSON.stringify(updated));
      return updated;
    });
    setComments(prev => {
      const updated = prev.filter(c => c.agentId !== agentId);
      localStorage.setItem('H_COMMENTS', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('H_USER', JSON.stringify(user));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('H_USER');
  };

  // --- Filtering & Sorting Logic ---
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.creatorDept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.likes - a.likes; // default: likes
  });

  // Featured / Banner agent of the month
  const featuredAgent = agents.find(a => a.badge === 'best_month') || agents[0] || null;

  const currentDetailedAgent = agents.find(a => a.id === selectedAgentId);
  const currentAgentComments = comments.filter(c => c.agentId === selectedAgentId);

  return (
    <div className="min-h-screen bg-hyundai-bg text-slate-800 flex flex-col font-sans" id="app-root">
      
      {/* Top Navbar Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        
        {/* VIEW 1: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-fade-in" id="gallery-view">
            
            {/* Filter Dashboard bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Category selector pills */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto" id="category-pills">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                    selectedCategory === 'all'
                      ? 'bg-hyundai-blue border-hyundai-blue text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  전체보기
                </button>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as CategoryType)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                      selectedCategory === key
                        ? 'bg-hyundai-blue border-hyundai-blue text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search & Sort operations */}
              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
                {/* Search box */}
                <div className="relative flex-grow sm:flex-grow-0">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="에이전트명, 제작자, 키워드 검색"
                    className="w-full sm:w-64 text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hyundai-blue focus:border-hyundai-blue bg-slate-50/50"
                    id="main-search-input"
                  />
                </div>

                {/* Sort selector dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none text-xs pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hyundai-blue focus:border-hyundai-blue bg-white font-bold text-slate-700"
                    id="sort-select-dropdown"
                  >
                    <option value="likes">🔥 추천순 정렬</option>
                    <option value="views">👀 조회수 정렬</option>
                    <option value="newest">📅 최신 등록순</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </div>
              </div>

            </div>

            {/* Catalog Grid */}
            {filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="agents-grid">
                {filteredAgents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={handleSelectAgent}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm space-y-3" id="no-results">
                <SlidersHorizontal className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">검색어 및 필터와 일치하는 에이전트가 없습니다.</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  철자나 검색어를 확인하거나 다른 카테고리를 눌러 새로운 AI 워크플로우를 둘러보세요.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: REGISTER/EDIT FORM */}
        {activeTab === 'register' && (
          <AgentForm
            currentUser={currentUser}
            onSubmit={handleSubmitAgent}
            onCancel={() => { setEditingAgent(null); setActiveTab('gallery'); }}
            editingAgent={editingAgent}
          />
        )}

        {/* VIEW 3: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <Leaderboard
            agents={agents}
            comments={comments}
            onSelectAgent={handleSelectAgent}
          />
        )}

        {/* VIEW 4: MY PAGE */}
        {activeTab === 'mypage' && (
          <MyPage
            currentUser={currentUser}
            agents={agents}
            comments={comments}
            onSelectAgent={handleSelectAgent}
            onEditAgent={handleEditAgent}
            onDeleteAgent={handleDeleteAgent}
            onOpenLogin={() => setShowLoginModal(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-hyundai-navy border-t border-hyundai-blue/20 text-slate-400 py-6 text-center text-xs" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-300">© 2026 현대코퍼레이션그룹. All Rights Reserved.</p>
          <p className="text-slate-400 font-mono text-[10px]">AI Bootcamp (Build My Agent) • Human Resource Development Group</p>
        </div>
      </footer>

      {/* --- Modals & Interstitials --- */}
      
      {/* 1. Agent Detail Modal */}
      {selectedAgentId && currentDetailedAgent && (
        <AgentDetail
          agent={currentDetailedAgent}
          comments={currentAgentComments}
          currentUser={currentUser}
          onClose={() => setSelectedAgentId(null)}
          onLike={handleLike}
          onReact={handleReact}
          onAddComment={handleAddComment}
          onUpdateBadge={handleUpdateBadge}
        />
      )}

      {/* 2. Authentication Modal */}
      {showLoginModal && (
        <AuthModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}
