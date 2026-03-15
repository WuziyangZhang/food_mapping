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
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, SceneType, MealPlan, Dish, ChatMessage, Post } from './types';
import { RESTAURANTS, MEAL_PLANS } from './data';
import { auth, db, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  arrayUnion, 
  arrayRemove,
  getDocFromServer
} from 'firebase/firestore';

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
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent hidden sm:block">
            大学城美食地图
          </h1>
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
          {[
            { id: 'home', label: '首页', icon: Utensils },
            { id: 'plaza', label: '美食广场', icon: Sparkles },
            { id: 'map', label: '地图', icon: MapIcon },
            { id: 'recipes', label: 'AI食谱', icon: Calendar },
            { id: 'new', label: '月月焕新', icon: Sparkles },
            { id: 'profile', label: '我的', icon: User },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative py-1 ${activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 hover:text-orange-400'}`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
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

// --- Food Plaza Component ---

const FoodPlaza = ({ user }: { user: FirebaseUser | null }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostRating, setNewPostRating] = useState(5);
  const [newPostImage, setNewPostImage] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
    }, (error) => {
      console.error('Firestore Error: ', error);
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    if (!newPostContent.trim() || !newPostImage.trim()) return;

    const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurantId);

    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.displayName || '匿名用户',
        userAvatar: user.photoURL || '',
        content: newPostContent,
        imageUrl: newPostImage,
        rating: newPostRating,
        restaurantId: selectedRestaurantId || null,
        restaurantName: restaurant?.name || null,
        createdAt: serverTimestamp(),
        likes: []
      });
      setIsPosting(false);
      setNewPostContent('');
      setNewPostImage('');
      setSelectedRestaurantId('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: string, likes: string[]) => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    const postRef = doc(db, 'posts', postId);
    const isLiked = likes.includes(user.uid);
    try {
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">美食广场</h2>
          <p className="text-gray-500">分享你的校园美食发现</p>
        </div>
        <button 
          onClick={() => user ? setIsPosting(true) : signInWithGoogle()}
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2"
        >
          <Sparkles size={18} />
          发布动态
        </button>
      </div>

      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-6 rounded-[2.5rem] border border-orange-100 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">发布新动态</h3>
              <button onClick={() => setIsPosting(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <textarea 
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="分享一下你的美食体验吧..."
                className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all h-32 outline-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">图片链接</label>
                  <input 
                    type="text" 
                    value={newPostImage}
                    onChange={e => setNewPostImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">关联餐厅 (可选)</label>
                  <select 
                    value={selectedRestaurantId}
                    onChange={e => setSelectedRestaurantId(e.target.value)}
                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  >
                    <option value="">不关联</option>
                    {RESTAURANTS.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">评分:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setNewPostRating(s)}
                        className={`p-1 transition-colors ${newPostRating >= s ? 'text-orange-500' : 'text-gray-300'}`}
                      >
                        <Star size={20} fill={newPostRating >= s ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleCreatePost}
                  className="ml-auto px-8 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all"
                >
                  发布
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <motion.div 
            key={post.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
          >
            <div className="relative aspect-square">
              <img src={post.imageUrl} alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl text-white">
                <img src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`} className="w-8 h-8 rounded-xl border-2 border-white/50" />
                <span className="text-xs font-bold pr-2">{post.userName}</span>
              </div>
              {post.restaurantName && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils size={14} className="text-orange-500" />
                    <span className="text-xs font-bold text-gray-900 line-clamp-1">{post.restaurantName}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-orange-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold">{post.rating}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">{post.content}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="text-[10px] text-gray-400">
                  {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : '刚刚'}
                </div>
                <button 
                  onClick={() => handleLike(post.id, post.likes)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${post.likes.includes(user?.uid || '') ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Heart size={14} fill={post.likes.includes(user?.uid || '') ? "currentColor" : "none"} />
                  {post.likes.length}
                </button>
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Test connection to Firestore
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);
  const [campus, setCampus] = useState('清华校区');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isTerminatorOpen, setIsTerminatorOpen] = useState(false);
  const [terminatorResult, setTerminatorResult] = useState<Restaurant | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);

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
    setTimeout(() => {
      const random = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
      setTerminatorResult(random);
      setIsTerminating(false);
    }, 2000);
  };

  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter(r => {
      const matchesCampus = r.campus === campus;
      const matchesSearch = !searchQuery || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.recommendedDishes.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCampus && matchesSearch;
    });
  }, [campus, searchQuery]);

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
        {activeTab === 'plaza' && <FoodPlaza user={user} />}
        {activeTab === 'home' && (
          <div className="space-y-12">
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

            {/* AI Hero Section */}
            <section className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:p-16 text-white shadow-2xl shadow-orange-200">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <Utensils size={400} strokeWidth={0.5} />
              </div>
              <div className="relative z-10 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <Sparkles className="text-orange-200" />
                  <span className="text-sm font-bold uppercase tracking-widest text-orange-100">AI 智能美食助手</span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black mb-8 leading-tight"
                >
                  今天吃什么？<br />别纠结了，AI帮你选
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-orange-100 uppercase">预算 (¥)</label>
                    <select 
                      value={aiBudget}
                      onChange={e => setAiBudget(e.target.value)}
                      className="w-full bg-white/20 border-transparent rounded-xl px-3 py-2 text-white focus:ring-0 cursor-pointer"
                    >
                      <option value="15" className="text-gray-900">15元以下 (极致省钱)</option>
                      <option value="25" className="text-gray-900">25元左右 (日常简餐)</option>
                      <option value="40" className="text-gray-900">40元左右 (品质生活)</option>
                      <option value="60" className="text-gray-900">60元左右 (偶尔改善)</option>
                      <option value="100" className="text-gray-900">100元以上 (聚餐大餐)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-orange-100 uppercase">用餐场景</label>
                    <select 
                      value={aiScene}
                      onChange={e => setAiScene(e.target.value as SceneType)}
                      className="w-full bg-white/20 border-transparent rounded-xl px-3 py-2 text-white focus:ring-0 cursor-pointer"
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
                      className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      立即推荐 <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {aiResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 space-y-4"
                    >
                      <div className="flex items-center gap-2 text-orange-100 text-sm font-bold">
                        <CheckCircle2 size={16} /> 为你精选了 3 家最匹配的餐厅：
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiResults.map(res => (
                          <motion.div 
                            key={res.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-4 flex flex-col gap-3 shadow-xl border border-orange-100 group"
                          >
                            <img src={res.image} className="w-full h-32 rounded-2xl object-cover shadow-sm" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="text-gray-900 font-bold mb-1 group-hover:text-orange-600 transition-colors">{res.name}</h4>
                              <p className="text-gray-500 text-xs mb-3">人均 ¥{res.avgPrice} · {res.campus}</p>
                              <button 
                                onClick={() => setSelectedRestaurant(res)}
                                className="w-full py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-xs hover:bg-orange-100 transition-colors"
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
            </section>

            {/* Quick Scenes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">快捷场景</h3>
                <button 
                  onClick={() => setActiveTab('map')}
                  className="text-orange-600 text-sm font-bold flex items-center gap-1"
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

            {/* Scene Results Section */}
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

            {/* Monthly New */}
            <section className="bg-orange-50/50 rounded-[3rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    月月焕新 <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded-md">MARCH</span>
                  </h3>
                  <p className="text-gray-500 text-sm">发现大学城最新入驻的宝藏店铺</p>
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

            {/* Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-orange-500" /> 今日热门 TOP 3
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Heart className="text-emerald-500" /> 健康轻食榜
                    </h3>
                    <button 
                      onClick={() => setActiveTab('map')}
                      className="text-orange-600 text-sm font-bold flex items-center gap-1"
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

              <aside className="space-y-8">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MapIcon className="text-orange-500" /> 地图预览
                  </h3>
                  <div className="aspect-square bg-orange-50 rounded-3xl relative overflow-hidden mb-4 border border-orange-100">
                    {/* Mock Map */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_0_100px_rgba(249,115,22,0.1)]" />
                      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_0_80px_rgba(249,115,22,0.1)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-4">
                        <MapPin className="mx-auto text-orange-500 mb-2" size={32} />
                        <p className="text-xs text-orange-600 font-bold">大学城核心区</p>
                        <p className="text-[10px] text-gray-400">已标记 {RESTAURANTS.length} 个点位</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('map')}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
                  >
                    进入完整地图
                  </button>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
                  <Dices size={40} className="mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold mb-2">纠结终结器</h3>
                  <p className="text-indigo-100 text-sm mb-6">实在不知道吃什么？让命运帮你做决定！</p>
                  <button 
                    onClick={() => setIsTerminatorOpen(true)}
                    className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition-transform shadow-lg"
                  >
                    别让我再想了！
                  </button>
                </div>
              </aside>
            </div>
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
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">价格区间</label>
                    <div className="flex gap-2">
                      {['¥20-', '¥20-50', '¥50+'].map(p => (
                        <button key={p} className="flex-1 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all">{p}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">特色标签</label>
                    <div className="flex flex-wrap gap-2">
                      {['新店', '学生优惠', '健身友好', '外卖'].map(t => (
                        <button key={t} className="px-3 py-1.5 text-xs font-medium bg-gray-100 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all">{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {filteredRestaurants.map(r => (
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
            <div className="flex-1 bg-orange-50 rounded-[3rem] relative overflow-hidden border border-orange-100 shadow-inner">
              <div className="absolute inset-0 p-12 opacity-10">
                <div className="w-full h-full border-2 border-dashed border-orange-300 rounded-full animate-pulse" />
              </div>
              {/* Mock Map Markers */}
              {filteredRestaurants.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{ 
                    top: `${30 + (i * 15)}%`, 
                    left: `${20 + (i * 20)}%` 
                  }}
                  onClick={() => setSelectedRestaurant(r)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-orange-500 group-hover:scale-125 transition-transform border-2 border-orange-100">
                      <Utensils size={20} />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {r.name}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                <button className="p-3 bg-white rounded-2xl shadow-lg text-gray-600 hover:text-orange-600 transition-colors"><Navigation size={20} /></button>
                <div className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button className="p-3 text-gray-600 hover:bg-gray-50 border-b border-gray-100">+</button>
                  <button className="p-3 text-gray-600 hover:bg-gray-50">-</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
            <header className="text-center mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">AI 校园营养管家</h2>
              <p className="text-gray-500">对话式定制你的每日健康食谱</p>
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
                    onClick={() => setActiveTab('recipes')}
                    className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 hover:bg-white/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={20} />
                      <span className="font-bold text-sm">查看今日健康食谱</span>
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

        {isTerminatorOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-indigo-900/60 backdrop-blur-md"
            onClick={() => setIsTerminatorOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] p-10 text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Dices size={40} className={isTerminating ? 'animate-spin' : ''} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">纠结终结器</h2>
              <p className="text-gray-500 mb-8">别想了，命运已经为你选好了！</p>
              
              <div className="min-h-[160px] flex items-center justify-center mb-8">
                {isTerminating ? (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <p className="text-indigo-600 font-bold animate-pulse">正在从 {RESTAURANTS.length} 家餐厅中随机挑选...</p>
                  </div>
                ) : terminatorResult ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-indigo-50 p-6 rounded-3xl w-full flex items-center gap-4"
                  >
                    <img src={terminatorResult.image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                    <div className="text-left">
                      <div className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-1">今日天选</div>
                      <h4 className="text-xl font-bold text-gray-900">{terminatorResult.name}</h4>
                      <p className="text-gray-500 text-xs">{terminatorResult.category} · ¥{terminatorResult.avgPrice}/人</p>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-gray-300 italic">准备好了吗？</p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleTerminate}
                  disabled={isTerminating}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {terminatorResult ? '再选一次' : '开始挑选'}
                </button>
                {terminatorResult && (
                  <button 
                    onClick={() => { setSelectedRestaurant(terminatorResult); setIsTerminatorOpen(false); }}
                    className="flex-1 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    就吃这家！
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
  );
}
