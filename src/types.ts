export interface Dish {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  healthTags: string[];
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  content: string;
  images: string[];
  rating: number;
  orderedDishes: string[];
  likes: number;
  comments: PostComment[];
  createdAt: string;
}

export interface PostComment {
  id: string;
  userId?: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  campus: string;
  category: string;
  avgPrice: number;
  rating: number;
  distance: number;
  isNew: boolean;
  isHealthyFriendly: boolean;
  hasStudentDeal: boolean;
  yesterdayOrders: number;
  tags: string[];
  image: string;
  description: string;
  recommendedDishes: Dish[];
  menu?: Dish[];
  businessHours: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  savingTip?: string;
  taste?: string[];
  cuisineType?: string[];
}

export type SceneType = 
  | '一人食' 
  | '朋友聚餐' 
  | '图书馆速食' 
  | '夜宵续命' 
  | '健身轻食' 
  | '下雨天最近' 
  | '约会氛围' 
  | '宿舍外卖';

export interface MealPlan {
  day: string;
  meals: {
    type: '早餐' | '午餐' | '晚餐' | '加餐';
    dishName: string;
    restaurantName: string;
    calories: number;
    budget: number;
    reason: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  mealPlan?: MealPlan;
}
