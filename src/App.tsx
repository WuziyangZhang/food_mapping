/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  Utensils, 
  Sparkles, 
  ChevronRight, 
  Filter, 
  Star, 
  Clock, 
  Navigation, 
  Heart, 
  Flame, 
  TrendingUp, 
  Calendar,
  X,
  Dices,
  ChevronDown,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Info,
  User,
  Send,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  MessageCircle,
  GraduationCap,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, SceneType, MealPlan, Dish, ChatMessage, Post } from './types';
import { RESTAURANTS, MEAL_PLANS, posts as initialPosts } from './data';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab, campus, setCampus, searchQuery, setSearchQuery }: { 
  activeTab: string, 
  setActiveTab: (t: string) => void,
  campus: string,
  setCampus: (c: string) => void,
  searchQuery: string,
  setSearchQuery: (q: string) => void
}) => {
  const [isCampusOpen, setIsCampusOpen] = useState(false);
  const campuses = ['清华校区', '北大校区', '人大校区', '北航校区', '北师大校区'];

  const tabs = [
    { id: 'home', label: '首页', icon: Utensils },
    { id: 'map', label: '地图', icon: MapIcon },
    { id: 'community', label: '社区', icon: Heart },
    { id: 'diet-plan', label: 'AI饮食计划', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
            <Utensils size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent hidden lg:block">
            大学城美食地图
          </h1>
        </div>

        {/* Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Campus */}
        <div className="flex-1 max-w-xl flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索餐厅、菜品、口味..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-full transition-all text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsCampusOpen(!isCampusOpen)}
              className="flex items-center gap-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors whitespace-nowrap"
            >
              <MapPin size={16} />
              {campus}
              <ChevronDown size={14} className={`transition-transform ${isCampusOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isCampusOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-orange-50 overflow-hidden py-1"
                >
                  {campuses.map(c => (
                    <button
                      key={c}
                      onClick={() => { setCampus(c); setIsCampusOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${campus === c ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative py-1 ${activeTab === 'profile' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-400'}`}
          >
            <User size={18} />
            我的
            {activeTab === 'profile' && (
              <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle (Simplified) */}
        <button className="md:hidden p-2 text-gray-500">
          <Filter size={24} />
        </button>
      </div>
    </nav>
  );
};

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  rank?: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick, rank }) => {
  return (
    <motion.div 
      layout
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all cursor-pointer group relative"
    >
      {rank && (
        <div className="absolute top-0 left-0 z-10 w-12 h-12 flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white shadow-lg ${
            rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-400' : 'bg-amber-600'
          }`}>
            {rank}
          </div>
        </div>
      )}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {restaurant.isNew && (
            <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-lg shadow-lg uppercase tracking-wider">NEW</span>
          )}
          {restaurant.hasStudentDeal && (
            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg uppercase tracking-wider">学生优惠</span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between text-white text-xs font-medium">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              {restaurant.campus} · 距我 {restaurant.distance}km
            </div>
            {restaurant.yesterdayOrders && (
              <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp size={10} />
                昨日 {restaurant.yesterdayOrders} 单
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
            <Star size={14} fill="currentColor" />
            {restaurant.rating}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{restaurant.category}</span>
          <span className="text-xs font-bold text-orange-600">¥{restaurant.avgPrice}/人</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-md">#{tag}</span>
          ))}
        </div>
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Utensils size={12} className="text-orange-400" />
            推荐: {restaurant.recommendedDishes[0].name}
          </div>
          {restaurant.isHealthyFriendly && (
            <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600" title="健康友好">
              <Flame size={14} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DetailModal = ({ restaurant, onClose }: { restaurant: Restaurant, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'menu'>('recommended');
  const [isFavorited, setIsFavorited] = useState(false);

  const getOpeningStatus = (hours: string) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    try {
      const [startStr, endStr] = hours.split(' - ');
      const [startH, startM] = startStr.split(':').map(Number);
      const [endH, endM] = endStr.split(':').map(Number);
      
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;

      if (end < start) { // Over midnight
        return (currentTime >= start || currentTime < end) ? '营业中' : '已打烊';
      }
      return (currentTime >= start && currentTime < end) ? '营业中' : '已打烊';
    } catch (e) {
      return '营业中';
    }
  };

  const status = getOpeningStatus(restaurant.businessHours);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Image & Basic Info */}
        <div className="md:w-5/12 relative h-64 md:h-auto">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors md:hidden"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
            <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Star size={16} fill="currentColor" className="text-orange-400" />
                <span className="font-bold">评分 {restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Navigation size={16} />
                <span>距我 {restaurant.distance}km</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">¥{restaurant.avgPrice}/人</span>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === '营业中' ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                {status}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:w-7/12 p-6 md:p-10 overflow-y-auto bg-orange-50/30 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white text-orange-600 text-xs font-medium rounded-full border border-orange-100 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed italic">"{restaurant.description}"</p>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:flex p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Clock size={14} /> 营业时间
              </h4>
              <p className="text-gray-800 font-medium text-sm">{restaurant.businessHours}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin size={14} /> 店铺位置
              </h4>
              <p className="text-gray-800 font-medium text-sm line-clamp-1">{restaurant.location.address}</p>
            </div>
          </div>

          {/* Menu Tabs */}
          <div className="mb-6">
            <div className="flex gap-4 border-b border-orange-100 mb-4">
              <button 
                onClick={() => setActiveTab('recommended')}
                className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'recommended' ? 'text-orange-600' : 'text-gray-400'}`}
              >
                推荐菜品
                {activeTab === 'recommended' && <motion.div layoutId="menu-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('menu')}
                className={`pb-2 text-sm font-bold transition-all relative ${activeTab === 'menu' ? 'text-orange-600' : 'text-gray-400'}`}
              >
                完整菜单
                {activeTab === 'menu' && <motion.div layoutId="menu-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />}
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {(activeTab === 'recommended' ? restaurant.recommendedDishes : (restaurant.menu || restaurant.recommendedDishes)).map(dish => (
                <div key={dish.name} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50 flex items-center justify-between group hover:border-orange-200 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">{dish.name}</span>
                      {dish.healthTags.map(ht => (
                        <span key={ht} className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">{ht}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400" /> {dish.calories} kcal</span>
                      <span>蛋白质: {dish.protein}g</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-orange-600">¥{dish.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-6 flex flex-col gap-4">
            <div className="flex gap-3">
              <button 
                onClick={() => setIsFavorited(!isFavorited)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all border ${isFavorited ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                {isFavorited ? '已收藏' : '收藏'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 transition-all">
                <Send size={18} />
                分享
              </button>
            </div>
            <button className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
              <Navigation size={22} />
              去这里
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CommunityView = ({ 
  posts, 
  searchQuery, 
  setSearchQuery, 
  onPostClick,
  onPublishClick 
}: { 
  posts: Post[], 
  searchQuery: string, 
  setSearchQuery: (q: string) => void,
  onPostClick: (post: Post) => void,
  onPublishClick: () => void
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900">校园食刻</h2>
          <p className="text-gray-500">发现身边真实的美味评价</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索笔记、餐厅或美食..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none shadow-sm"
            />
          </div>
          <button 
            onClick={onPublishClick}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles size={18} />
            发布笔记
          </button>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {posts.map(post => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onPostClick(post)}
            className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="relative">
              <img src={post.images[0]} className="w-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} fill="currentColor" className="text-yellow-400" />
                {post.rating}
              </div>
            </div>
            <div className="p-5 space-y-4">
              <h3 className="font-bold text-lg leading-tight group-hover:text-orange-600 transition-colors">{post.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
              
              <div className="flex flex-wrap gap-2">
                {post.orderedDishes.map((dish: string) => (
                  <span key={dish} className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded-lg">
                    #{dish}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={post.userAvatar} className="w-6 h-6 rounded-full bg-gray-100" />
                  <span className="text-xs font-bold text-gray-700">{post.userName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                    <Heart size={14} />
                    <span className="text-xs font-bold">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                    <MessageCircle size={14} />
                    <span className="text-xs font-bold">{post.comments.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-1">
                  <MapPin size={12} />
                  {post.restaurantName}
                </div>
                <p className="text-[10px] text-gray-400 italic">“味道真的很赞，下次还来！”</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [campus, setCampus] = useState('清华校区');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isTerminatorOpen, setIsTerminatorOpen] = useState(false);
  const [terminatorStep, setTerminatorStep] = useState(1);
  const [terminatorData, setTerminatorData] = useState({ number: '', color: '', person: '' });
  const [terminatorResult, setTerminatorResult] = useState<{ restaurant: Restaurant, dish: string, reason: string } | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  
  // Map Filters
  const [mapTasteFilter, setMapTasteFilter] = useState<string>('全部');
  const [mapCuisineFilter, setMapCuisineFilter] = useState<string>('全部');
  const [mapPriceFilter, setMapPriceFilter] = useState<[number, number]>([0, 100]);
  const [mapDistanceFilter, setMapDistanceFilter] = useState<number>(5);

  // AI Recommendation State
  const [aiBudget, setAiBudget] = useState('30');
  const [aiScene, setAiScene] = useState<SceneType>('一人食');
  const [aiResults, setAiResults] = useState<Restaurant[]>([]);
  const [activeSceneFilter, setActiveSceneFilter] = useState<SceneType | null>(null);
  const sceneResultsRef = React.useRef<HTMLDivElement>(null);

  const handleAiRecommend = () => {
    const filtered = RESTAURANTS.filter(r => 
      r.avgPrice <= parseInt(aiBudget) + 15 && 
      r.tags.includes(aiScene)
    );
    
    // Pick 3 random restaurants from filtered or all
    const source = filtered.length >= 3 ? filtered : RESTAURANTS;
    const shuffled = [...source].sort(() => 0.5 - Math.random());
    setAiResults(shuffled.slice(0, 3));
  };

  // AI Recipe Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: '你好！我是你的校园营养管家。我可以根据你的健康目标（减脂、增肌等）和校园周边餐厅，为你定制专属食谱。你想聊聊今天的饮食计划吗？'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `收到！针对你的需求“${text}”，我为你生成了今日推荐方案。`,
        mealPlan: MEAL_PLANS[Math.floor(Math.random() * MEAL_PLANS.length)]
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsChatLoading(false);
    }, 1500);
  };

  const handleTerminate = () => {
    setIsTerminating(true);
    setTerminatorResult(null);
    
    // Simulate complex "abstract" logic based on inputs
    setTimeout(() => {
      const randomRes = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
      const randomDish = randomRes.menu ? randomRes.menu[Math.floor(Math.random() * randomRes.menu.length)].name : randomRes.recommendedDishes[0].name;
      
      const reasons = [
        `数字${terminatorData.number}代表了你今天的幸运能量，而${terminatorData.color}色象征着你内心渴望的一丝慰藉。想到${terminatorData.person}，说明你现在需要一份温暖的食物来填补情感的空缺。`,
        `根据你的直觉选择，${terminatorData.color}色与数字${terminatorData.number}的碰撞预示着一场味蕾的冒险。${terminatorData.person}的存在提醒你，分享美食才是最高级的浪漫。`,
        `这组抽象的组合——${terminatorData.number}、${terminatorData.color}以及对${terminatorData.person}的思念，完美契合了这家店的独特气质。去试试吧，会有意想不到的惊喜。`
      ];
      
      setTerminatorResult({
        restaurant: randomRes,
        dish: randomDish,
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      });
      setIsTerminating(false);
    }, 2000);
  };

  const filteredRestaurants = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return RESTAURANTS.filter(r => r.campus === campus);

    return RESTAURANTS.filter(r => {
      const matchesCampus = r.campus === campus;
      if (!matchesCampus) return false;

      const nameMatch = r.name.toLowerCase().includes(query);
      const categoryMatch = r.category.toLowerCase().includes(query);
      const tagMatch = r.tags.some(t => t.toLowerCase().includes(query));
      const dishMatch = r.recommendedDishes.some(d => d.name.toLowerCase().includes(query)) ||
                        (r.menu && r.menu.some(m => m.name.toLowerCase().includes(query)));
      
      return nameMatch || categoryMatch || tagMatch || dishMatch;
    }).sort((a, b) => {
      // Prioritize name matches
      const aNameMatch = a.name.toLowerCase().includes(query);
      const bNameMatch = b.name.toLowerCase().includes(query);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return 0;
    });
  }, [campus, searchQuery]);

  const filteredCommunityPosts = useMemo(() => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(communitySearchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(communitySearchQuery.toLowerCase()) ||
      post.restaurantName.toLowerCase().includes(communitySearchQuery.toLowerCase())
    );
  }, [posts, communitySearchQuery]);

  const mapFilteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter(r => {
      const matchTaste = mapTasteFilter === '全部' || r.taste.includes(mapTasteFilter);
      const matchCuisine = mapCuisineFilter === '全部' || r.cuisineType.includes(mapCuisineFilter);
      const matchPrice = r.avgPrice >= mapPriceFilter[0] && r.avgPrice <= mapPriceFilter[1];
      const matchDistance = r.distance <= mapDistanceFilter;
      return matchTaste && matchCuisine && matchPrice && matchDistance;
    });
  }, [mapTasteFilter, mapCuisineFilter, mapPriceFilter, mapDistanceFilter]);

  const schools = [
    { id: 's1', name: '清华大学', lat: 40.00, lng: 116.32 },
    { id: 's2', name: '北京大学', lat: 39.99, lng: 116.31 },
    { id: 's3', name: '北京航空航天大学', lat: 39.98, lng: 116.34 },
    { id: 's4', name: '中国人民大学', lat: 39.97, lng: 116.31 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        campus={campus} 
        setCampus={setCampus} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-16">
            {/* Search Results Section */}
            <AnimatePresence>
              {searchQuery && (
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-[3rem] p-8 border border-orange-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Search size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">搜索结果: "{searchQuery}"</h3>
                        <p className="text-gray-500 text-sm">找到 {filteredRestaurants.length} 家匹配的餐厅</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredRestaurants.map(r => (
                        <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-gray-500">未找到匹配的餐厅，换个关键词试试吧</p>
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>

            {/* AI Assistant Hero */}
            <section>
              <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:p-10 text-white shadow-2xl shadow-orange-200">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <Utensils size={300} strokeWidth={0.5} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-orange-200" size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-100">AI 智能美食助手</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                    今天吃什么？<br />别纠结了，AI帮你选
                  </h2>
                  
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-orange-100 uppercase">预算 (¥)</label>
                      <select 
                        value={aiBudget}
                        onChange={e => setAiBudget(e.target.value)}
                        className="w-full bg-white/20 border-transparent rounded-lg px-3 py-1.5 text-sm text-white focus:ring-0 cursor-pointer"
                      >
                        <option value="15" className="text-gray-900">15元以下 (极致省钱)</option>
                        <option value="25" className="text-gray-900">25元左右 (日常简餐)</option>
                        <option value="40" className="text-gray-900">40元左右 (品质生活)</option>
                        <option value="60" className="text-gray-900">60元左右 (偶尔改善)</option>
                        <option value="100" className="text-gray-900">100元以上 (聚餐大餐)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-orange-100 uppercase">用餐场景</label>
                      <select 
                        value={aiScene}
                        onChange={e => setAiScene(e.target.value as SceneType)}
                        className="w-full bg-white/20 border-transparent rounded-lg px-3 py-1.5 text-sm text-white focus:ring-0 cursor-pointer"
                      >
                        <option value="一人食" className="text-gray-900">一人食</option>
                        <option value="朋友聚餐" className="text-gray-900">朋友聚餐</option>
                        <option value="图书馆速食" className="text-gray-900">图书馆速食</option>
                        <option value="夜宵续命" className="text-gray-900">夜宵续命</option>
                        <option value="健身轻食" className="text-gray-900">健身轻食</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={handleAiRecommend}
                        className="w-full bg-white text-orange-600 font-bold py-2 rounded-lg text-sm hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        立即推荐 <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {aiResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                      >
                        <div className="flex items-center gap-2 text-orange-100 text-xs font-bold">
                          <CheckCircle2 size={14} /> 为你精选了 3 家最匹配的餐厅：
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {aiResults.map(res => (
                            <motion.div 
                              key={res.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-white rounded-2xl p-3 flex flex-col gap-2 shadow-xl border border-orange-100 group"
                            >
                              <img src={res.image} className="w-full h-24 rounded-xl object-cover shadow-sm" referrerPolicy="no-referrer" />
                              <div>
                                <h4 className="text-gray-900 font-bold text-sm mb-0.5 group-hover:text-orange-600 transition-colors">{res.name}</h4>
                                <p className="text-gray-500 text-[10px] mb-2">人均 ¥{res.avgPrice} · {res.campus}</p>
                                <button 
                                  onClick={() => setSelectedRestaurant(res)}
                                  className="w-full py-1.5 bg-orange-50 text-orange-600 rounded-lg font-bold text-[10px] hover:bg-orange-100 transition-colors"
                                >
                                  查看详情
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Quick Scenes */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                    <MapIcon size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">快捷场景</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('map')}
                  className="text-orange-600 text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  查看全部 <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {[
                  { label: '一人食', icon: '🍱', color: 'bg-blue-50 text-blue-600' },
                  { label: '朋友聚餐', icon: '🥘', color: 'bg-orange-50 text-orange-600' },
                  { label: '图书馆速食', icon: '🥪', color: 'bg-amber-50 text-amber-600' },
                  { label: '夜宵续命', icon: '🍜', color: 'bg-indigo-50 text-indigo-600' },
                  { label: '健身轻食', icon: '🥗', color: 'bg-emerald-50 text-emerald-600' },
                  { label: '下雨天最近', icon: '☔', color: 'bg-cyan-50 text-cyan-600' },
                  { label: '约会氛围', icon: '🕯️', color: 'bg-rose-50 text-rose-600' },
                  { label: '宿舍外卖', icon: '🛵', color: 'bg-slate-50 text-slate-600' },
                ].map(scene => (
                  <motion.button
                    key={scene.label}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      setActiveSceneFilter(scene.label as SceneType);
                      setTimeout(() => {
                        sceneResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all border border-transparent hover:border-current/10 ${activeSceneFilter === scene.label ? 'ring-2 ring-current ring-offset-2' : ''} ${scene.color}`}
                  >
                    <span className="text-3xl">{scene.icon}</span>
                    <span className="text-xs font-bold whitespace-nowrap">{scene.label}</span>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Scene Results Section (Dynamic) */}
            <AnimatePresence>
              {activeSceneFilter && (
                <motion.section 
                  ref={sceneResultsRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-[3rem] p-8 border border-orange-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">"{activeSceneFilter}" 推荐餐厅</h3>
                        <p className="text-gray-500 text-sm">为你精选的校园周边最适合该场景的去处</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveSceneFilter(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {RESTAURANTS.filter(r => r.tags.includes(activeSceneFilter))
                      .slice(0, 4)
                      .map(r => (
                        <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} />
                      ))}
                  </div>
                  {RESTAURANTS.filter(r => r.tags.includes(activeSceneFilter)).length > 4 && (
                    <div className="mt-8 text-center">
                      <button 
                        onClick={() => setActiveTab('map')}
                        className="px-8 py-3 bg-orange-50 text-orange-600 font-bold rounded-2xl hover:bg-orange-100 transition-all"
                      >
                        查看更多相关餐厅
                      </button>
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>

            {/* Crazy Every Day - Student Discounts */}
            <section className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">疯狂每一天</h3>
                    <p className="text-gray-500 text-sm font-medium">学生专属特惠，每日更新</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold">
                  <Clock size={14} /> 距离结束还剩 05:24:12
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {RESTAURANTS.filter(r => r.hasStudentDeal).slice(0, 5).map(r => (
                  <motion.div 
                    key={r.id}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedRestaurant(r)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 shadow-md">
                      <img src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                        STUDENT DEAL
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-black text-lg leading-tight mb-1">{r.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-rose-400 font-black text-xl">¥{Math.floor(r.avgPrice * 0.7)}</span>
                          <span className="text-gray-400 text-xs line-through">¥{r.avgPrice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-2">
                      <p className="text-xs text-gray-500 font-bold mb-2 flex items-center gap-1">
                        <MapPin size={10} /> {r.campus}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {r.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Monthly New */}
            <section className="bg-orange-50/50 rounded-[3rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    月月焕新 <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded-md uppercase">March</span>
                  </h3>
                  <p className="text-gray-500 text-sm font-medium">发现大学城最新入驻的宝藏店铺</p>
                </div>
                <button 
                  onClick={() => setActiveTab('new')}
                  className="px-6 py-2 bg-white text-orange-600 font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-orange-100"
                >
                  探索新店
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {RESTAURANTS.filter(r => r.isNew).slice(0, 4).map(r => (
                  <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} />
                ))}
              </div>
            </section>

            {/* Trending & Healthy Lists */}
            <div className="space-y-16">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp size={20} />
                    </div>
                    今日热门 TOP 3
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {[...filteredRestaurants]
                    .sort((a, b) => (b.yesterdayOrders || 0) - (a.yesterdayOrders || 0))
                    .slice(0, 3)
                    .map((r, index) => (
                      <RestaurantCard 
                        key={r.id} 
                        restaurant={r} 
                        rank={index + 1}
                        onClick={() => setSelectedRestaurant(r)} 
                      />
                    ))}
                </div>
              </section>
              
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                      <Heart size={20} />
                    </div>
                    健康轻食榜
                  </h3>
                  <button 
                    onClick={() => setActiveTab('map')}
                    className="text-orange-600 text-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    查看全部 <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {RESTAURANTS.filter(r => r.isHealthyFriendly).slice(0, 4).map(r => (
                    <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} />
                  ))}
                </div>
              </section>
            </div>

            {/* Terminator Section */}
            <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-12 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold mb-4 backdrop-blur-md">
                    <Dices size={14} /> 纠结终结器
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-4">实在不知道吃什么？</h3>
                  <p className="text-indigo-100 text-lg opacity-80">别再浪费时间纠结了，让命运帮你做决定！</p>
                </div>
                <button 
                  onClick={() => setIsTerminatorOpen(true)}
                  className="px-12 py-5 bg-white text-indigo-600 font-black text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-indigo-900/20 whitespace-nowrap"
                >
                  立即开启命运之轮
                </button>
              </div>
            </section>

            {/* Map Preview (Bottom) */}
            <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                      <MapIcon size={20} />
                    </div>
                    美食地图预览
                  </h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    我们已在大学城核心区域为你标记了 {RESTAURANTS.length} 个优质美食点位。
                    通过地图模式，你可以更直观地发现身边的美味，查看实时距离和路线。
                  </p>
                  <button 
                    onClick={() => setActiveTab('map')}
                    className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                  >
                    进入完整地图
                  </button>
                </div>
                <div className="aspect-video bg-orange-50 rounded-[2.5rem] relative overflow-hidden border border-orange-100 group cursor-pointer" onClick={() => setActiveTab('map')}>
                  {/* Mock Map Visual */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_0_150px_rgba(249,115,22,0.1)]" />
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_0_120px_rgba(249,115,22,0.1)]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-center">
                      <MapPin className="mx-auto text-orange-500 mb-3" size={48} />
                      <p className="text-sm text-orange-600 font-black">大学城核心区</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters & List */}
            <div className="md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Filter size={18} className="text-orange-500" /> 筛选条件
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">口味偏好</label>
                    <div className="flex flex-wrap gap-2">
                      {['全部', '清淡', '咸鲜', '麻辣', '甜口', '酸辣'].map(t => (
                        <button 
                          key={t} 
                          onClick={() => setMapTasteFilter(t)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${mapTasteFilter === t ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">餐厅种类</label>
                    <div className="flex flex-wrap gap-2">
                      {['全部', '饭', '面', '火锅', '甜品', '饮品', '快餐'].map(c => (
                        <button 
                          key={c} 
                          onClick={() => setMapCuisineFilter(c)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${mapCuisineFilter === c ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">价格区间 (¥{mapPriceFilter[0]} - ¥{mapPriceFilter[1]})</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      value={mapPriceFilter[1]}
                      onChange={(e) => setMapPriceFilter([0, parseInt(e.target.value)])}
                      className="w-full accent-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">距离范围 ({mapDistanceFilter}km)</label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="10" 
                      step="0.1"
                      value={mapDistanceFilter}
                      onChange={(e) => setMapDistanceFilter(parseFloat(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {mapFilteredRestaurants.map(r => (
                  <div 
                    key={r.id}
                    onClick={() => setSelectedRestaurant(r)}
                    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:border-orange-200 transition-all"
                  >
                    <img src={r.image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-gray-900">{r.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 my-1">
                        <span className="flex items-center gap-0.5 text-orange-500 font-bold"><Star size={12} fill="currentColor" /> {r.rating}</span>
                        <span>¥{r.avgPrice}/人</span>
                        <span>· 距我 {r.distance}km</span>
                      </div>
                      <div className="flex gap-1">
                        {r.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Main Map Area */}
            <div className="flex-1 bg-[#f0f4f8] rounded-[3rem] relative overflow-hidden border border-gray-200 shadow-inner">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                  backgroundSize: '40px 40px' 
                }} />
                {/* Simulated Roads */}
                <div className="absolute top-1/4 left-0 w-full h-12 bg-white/50 -rotate-2" />
                <div className="absolute top-0 left-1/3 w-16 h-full bg-white/50 rotate-3" />
                <div className="absolute bottom-1/3 left-0 w-full h-8 bg-white/50 rotate-1" />
                {/* Simulated Greenery */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl" />
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl" />
              </div>

              {/* Schools Visualization */}
              {schools.map(s => {
                const top = ((40.01 - s.lat) / 0.05) * 100;
                const left = ((s.lng - 116.30) / 0.06) * 100;
                return (
                  <div 
                    key={s.id}
                    className="absolute z-10 flex flex-col items-center"
                    style={{ top: `${top}%`, left: `${left}%` }}
                  >
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/40 backdrop-blur-sm">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                        <GraduationCap size={20} />
                      </div>
                    </div>
                    <span className="mt-2 text-[10px] font-black text-blue-700 bg-white/80 px-2 py-0.5 rounded-full shadow-sm">{s.name}</span>
                  </div>
                );
              })}

              {/* Mock Map Markers for Restaurants */}
              {mapFilteredRestaurants.map((r, i) => {
                const top = ((40.01 - r.location.lat) / 0.05) * 100;
                const left = ((r.location.lng - 116.30) / 0.06) * 100;

                return (
                  <motion.div
                    key={r.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.02, type: 'spring' }}
                    className="absolute cursor-pointer group z-20"
                    style={{ top: `${top}%`, left: `${left}%` }}
                    onClick={() => setSelectedRestaurant(r)}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all border-2 border-orange-100 group-hover:border-orange-400">
                        <Utensils size={20} />
                      </div>
                      <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-lg border border-gray-100 scale-90 group-hover:scale-100 transition-transform">
                        <span className="text-[9px] font-black text-gray-800 whitespace-nowrap">{r.name}</span>
                      </div>
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white absolute -bottom-1" />
                    </div>
                  </motion.div>
                );
              })}

              {/* Map Controls */}
              <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-30">
                <button className="p-4 bg-white rounded-2xl shadow-xl text-gray-600 hover:text-orange-600 hover:scale-110 transition-all active:scale-95">
                  <Navigation size={24} />
                </button>
                <div className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <button className="p-4 text-gray-600 hover:bg-gray-50 border-b border-gray-100 font-bold text-xl">+</button>
                  <button className="p-4 text-gray-600 hover:bg-gray-50 font-bold text-xl">-</button>
                </div>
              </div>

              {/* Map Legend/Status */}
              <div className="absolute top-8 left-8 flex flex-col gap-2 z-30">
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-gray-600">当前校区: {campus}</span>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-xs font-bold text-gray-600">显示学校分布</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <CommunityView 
            posts={filteredCommunityPosts} 
            searchQuery={communitySearchQuery}
            setSearchQuery={setCommunitySearchQuery}
            onPostClick={setSelectedPost}
            onPublishClick={() => setIsPublishModalOpen(true)}
          />
        )}

        {activeTab === 'diet-plan' && (
          <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            <header className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mb-2">
                <Sparkles size={14} />
                AI 智能饮食管家
              </div>
              <h2 className="text-3xl font-black text-gray-900">定制你的校园饮食计划</h2>
            </header>

            <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                        {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                      </div>
                      <div className="space-y-4">
                        <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                          {msg.content}
                        </div>
                        {msg.mealPlan && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-orange-50 rounded-[2rem] overflow-hidden border border-orange-100 shadow-sm"
                          >
                            <div className="bg-orange-500 px-6 py-3 text-white flex items-center justify-between">
                              <span className="font-bold text-sm">{msg.mealPlan.day} 推荐方案</span>
                              <span className="text-xs opacity-90 flex items-center gap-1"><Flame size={12} /> 约 1300 kcal</span>
                            </div>
                            <div className="p-4 space-y-4">
                              {msg.mealPlan.meals.map((meal, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex gap-3 items-start cursor-pointer group/meal hover:bg-white/40 p-2 rounded-2xl transition-colors"
                                  onClick={() => {
                                    const res = RESTAURANTS.find(r => r.name === meal.restaurantName);
                                    if (res) setSelectedRestaurant(res);
                                  }}
                                >
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-bold text-orange-600 shrink-0 shadow-sm border border-orange-50 group-hover/meal:scale-110 transition-transform">
                                    {meal.type}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                      <span className="text-sm font-bold text-gray-900 group-hover/meal:text-orange-600 transition-colors">{meal.dishName}</span>
                                      <span className="text-xs font-bold text-orange-600">¥{meal.budget}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                                      {meal.restaurantName} · {meal.calories} kcal
                                      <ArrowRight size={10} className="opacity-0 group-hover/meal:opacity-100 transition-opacity" />
                                    </p>
                                    <div className="bg-white/60 p-2 rounded-lg text-[10px] text-gray-600 leading-tight border border-orange-50/50">
                                      {meal.reason}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center animate-pulse">
                        <Sparkles size={20} />
                      </div>
                      <div className="bg-gray-100 p-4 rounded-3xl rounded-tl-none">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  {['我想减脂，推荐一下', '增肌食谱有哪些？', '今天预算50元', '推荐清淡一点的'].map(prompt => (
                    <button 
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage(chatInput)}
                    placeholder="输入你的饮食需求..." 
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  />
                  <button 
                    onClick={() => handleSendMessage(chatInput)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-orange-500 border-4 border-white shadow-xl">
                  <User size={64} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black text-gray-900 mb-2">王小明</h2>
                <p className="text-gray-500 mb-4">清华大学 · 计算机系 · 大三学生</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full">美食达人 LV.4</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">健身爱好者</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">省钱小能手</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"><Settings size={20} /></button>
                <button className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"><LogOut size={20} /></button>
              </div>
            </section>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '收藏餐厅', value: '24', icon: Heart, color: 'text-rose-500' },
                { label: '打卡次数', value: '156', icon: MapPin, color: 'text-orange-500' },
                { label: '省钱金额', value: '¥428', icon: TrendingUp, color: 'text-emerald-500' },
                { label: '评价记录', value: '42', icon: Star, color: 'text-amber-500' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                  <stat.icon size={24} className={`mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <History className="text-orange-500" /> 最近足迹
                </h3>
                <div className="space-y-6">
                  {RESTAURANTS.slice(0, 3).map(r => (
                    <div key={r.id} className="flex gap-4 items-center group cursor-pointer" onClick={() => setSelectedRestaurant(r)}>
                      <img src={r.image} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{r.name}</h4>
                        <p className="text-xs text-gray-500">2026-03-12 · 消费 ¥{r.avgPrice}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  ))}
                </div>
              </section>

              {/* AI Recommendations Shortcut */}
              <section className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="text-orange-200" /> 你的专属 AI 推荐
                </h3>
                <p className="text-orange-100 text-sm mb-8 leading-relaxed">
                  基于你的口味偏好和健身目标，我们为你准备了新的推荐方案。
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('diet-plan')}
                    className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 hover:bg-white/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={20} />
                      <span className="font-bold text-sm">查看今日健康饮食计划</span>
                    </div>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 hover:bg-white/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Utensils size={20} />
                      <span className="font-bold text-sm">去首页看看新推荐</span>
                    </div>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <div className="space-y-12">
            <header className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mb-4">
                <Sparkles size={14} /> NEW ARRIVALS
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">月月焕新专区</h2>
              <p className="text-gray-500">我们为你搜罗了大学城周边最新开业的餐厅和最新上架的单品，拒绝一成不变，今天就去尝鲜！</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {RESTAURANTS.filter(r => r.isNew).map(r => (
                <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <Utensils size={18} />
            </div>
            <span className="font-bold text-gray-900">大学城美食地图</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-orange-600 transition-colors">关于我们</a>
            <a href="#" className="hover:text-orange-600 transition-colors">商家入驻</a>
            <a href="#" className="hover:text-orange-600 transition-colors">用户协议</a>
            <a href="#" className="hover:text-orange-600 transition-colors">隐私政策</a>
          </div>
          <p className="text-xs text-gray-400">© 2026 大学城美食地图. 为学生而生.</p>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {selectedRestaurant && (
          <DetailModal 
            restaurant={selectedRestaurant} 
            onClose={() => setSelectedRestaurant(null)} 
          />
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="md:w-1/2 bg-gray-100 relative">
                <img src={selectedPost.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/40 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="md:w-1/2 p-8 overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <img src={selectedPost.userAvatar} className="w-12 h-12 rounded-2xl" />
                    <div>
                      <h4 className="font-bold text-gray-900">{selectedPost.userName}</h4>
                      <p className="text-xs text-gray-400">{selectedPost.createdAt}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-xl text-sm hover:bg-orange-100 transition-colors">关注</button>
                </div>

                <div className="flex-1 space-y-6">
                  <h2 className="text-2xl font-black text-gray-900">{selectedPost.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{selectedPost.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.orderedDishes.map(dish => (
                      <span key={dish} className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full">#{dish}</span>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">探店餐厅</p>
                        <p className="font-bold text-gray-900">{selectedPost.restaurantName}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const res = RESTAURANTS.find(r => r.id === selectedPost.restaurantId);
                        if (res) setSelectedRestaurant(res);
                        setSelectedPost(null);
                      }}
                      className="p-2 text-orange-500 hover:bg-orange-100 rounded-xl transition-colors"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <MessageCircle size={18} className="text-orange-500" /> 评论 ({selectedPost.comments.length})
                    </h4>
                    {selectedPost.comments.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPost.comments.map(comment => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                            <div className="flex-1 bg-gray-50 p-3 rounded-2xl">
                              <p className="text-xs font-bold text-gray-900 mb-1">{comment.userName}</p>
                              <p className="text-xs text-gray-600">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">暂无评论，快来抢沙发吧~</p>
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="说点什么吧..." 
                      className="w-full pl-4 pr-10 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                      <Send size={16} />
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                    <Heart size={20} />
                    <span className="text-xs font-bold">{selectedPost.likes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Publish Note Modal */}
        {isPublishModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900">发布新笔记</h2>
                <button 
                  onClick={() => setIsPublishModalOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                    <Plus size={32} />
                    <span className="text-xs font-bold mt-2">添加图片</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="填写标题会有更多人看哦~" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold"
                  />
                  <textarea 
                    placeholder="分享你的美食体验..." 
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="关联餐厅" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="推荐菜品" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setIsPublishModalOpen(false)}
                  className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all"
                >
                  立即发布
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isTerminatorOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-indigo-900/60 backdrop-blur-md"
            onClick={() => {
              setIsTerminatorOpen(false);
              setTerminatorStep(1);
              setTerminatorResult(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] p-10 text-center shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => {
                  setIsTerminatorOpen(false);
                  setTerminatorStep(1);
                  setTerminatorResult(null);
                }}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              {!terminatorResult ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Dices size={40} className={isTerminating ? 'animate-spin' : ''} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">纠结终结器 2.0</h2>
                    <p className="text-gray-500 mb-8">完成3步趣味问卷，让直觉为你做决定</p>
                  </div>

                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`w-12 h-1.5 rounded-full transition-all ${terminatorStep >= s ? 'bg-indigo-500' : 'bg-gray-100'}`} />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {terminatorStep === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <label className="block text-center font-bold text-gray-700">1. 在1-10中选择一个你现在的幸运数字</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <button 
                              key={n}
                              onClick={() => {
                                setTerminatorData(prev => ({ ...prev, number: n.toString() }));
                                setTerminatorStep(2);
                              }}
                              className="py-3 rounded-xl border-2 border-gray-100 font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all"
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {terminatorStep === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <label className="block text-center font-bold text-gray-700">2. 选一个你现在心中第一个想到的颜色</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: '热情红', color: 'bg-red-500' },
                            { name: '忧郁蓝', color: 'bg-blue-500' },
                            { name: '活力橙', color: 'bg-orange-500' },
                            { name: '清新绿', color: 'bg-green-500' },
                            { name: '神秘紫', color: 'bg-purple-500' },
                            { name: '明亮黄', color: 'bg-yellow-400' }
                          ].map(c => (
                            <button 
                              key={c.name}
                              onClick={() => {
                                setTerminatorData(prev => ({ ...prev, color: c.name }));
                                setTerminatorStep(3);
                              }}
                              className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 transition-all"
                            >
                              <div className={`w-8 h-8 rounded-full ${c.color}`} />
                              <span className="text-xs font-bold">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {terminatorStep === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <label className="block text-center font-bold text-gray-700">3. 选一个你第一个想到的人和他的关系</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['暗恋对象', '死党闺蜜', '严厉导师', '远方父母', '竞争对手', '未来的自己'].map(p => (
                            <button 
                              key={p}
                              onClick={() => {
                                setTerminatorData(prev => ({ ...prev, person: p }));
                                handleTerminate();
                              }}
                              className="py-4 rounded-2xl border-2 border-gray-100 font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all text-sm"
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isTerminating && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-indigo-600 font-bold animate-pulse">正在根据你的直觉计算美食能量...</p>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-8"
                >
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-indigo-500 uppercase tracking-widest">命运的指引</div>
                    <h3 className="text-3xl font-black text-gray-900">就是它了！</h3>
                  </div>

                  <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <img src={terminatorResult.restaurant.image} className="w-full h-48 rounded-3xl object-cover mb-6 shadow-lg" referrerPolicy="no-referrer" />
                    <h4 className="text-2xl font-black text-indigo-900 mb-2">{terminatorResult.restaurant.name}</h4>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-black shadow-sm mb-4">
                      推荐菜：{terminatorResult.dish}
                    </div>
                    <p className="text-indigo-700/70 text-sm leading-relaxed italic">
                      “{terminatorResult.reason}”
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setTerminatorStep(1);
                        setTerminatorResult(null);
                      }}
                      className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      重新测试
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedRestaurant(terminatorResult.restaurant);
                        setIsTerminatorOpen(false);
                      }}
                      className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                    >
                      立即前往
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
