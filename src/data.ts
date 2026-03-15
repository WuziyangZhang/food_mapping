import { Restaurant, MealPlan } from './types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: '学子居黄焖鸡',
    campus: '清华校区',
    category: '中式快餐',
    avgPrice: 25,
    rating: 4.5,
    distance: 0.3,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 156,
    tags: ['一人食', '宿舍外卖', '平价'],
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=600&q=80', // Braised chicken
    description: '经典的黄焖鸡米饭，浓郁的汤汁拌饭简直一绝，是学生党的外卖首选。',
    businessHours: '10:00 - 22:00',
    location: { lat: 39.99, lng: 116.32, address: '清华大学西门外100米' },
    savingTip: '美团外卖领券后仅需19.9元，到店出示学生证可免费加饭。',
    recommendedDishes: [
      { name: '招牌黄焖鸡', calories: 650, protein: 35, carbs: 45, fat: 28, price: 22, healthTags: ['高蛋白'] },
      { name: '香辣排骨饭', calories: 720, protein: 30, carbs: 50, fat: 32, price: 28, healthTags: [] }
    ],
    menu: [
      { name: '招牌黄焖鸡', calories: 650, protein: 35, carbs: 45, fat: 28, price: 22, healthTags: ['高蛋白'] },
      { name: '香辣排骨饭', calories: 720, protein: 30, carbs: 50, fat: 32, price: 28, healthTags: [] },
      { name: '土豆炖牛肉', calories: 580, protein: 28, carbs: 40, fat: 22, price: 26, healthTags: [] },
      { name: '酸辣土豆丝', calories: 220, protein: 4, carbs: 35, fat: 8, price: 12, healthTags: ['低脂'] },
      { name: '西红柿炒鸡蛋', calories: 310, protein: 12, carbs: 15, fat: 22, price: 15, healthTags: [] }
    ]
  },
  {
    id: '2',
    name: '绿野轻食社',
    campus: '北大校区',
    category: '健康轻食',
    avgPrice: 45,
    rating: 4.8,
    distance: 0.5,
    isNew: true,
    isHealthyFriendly: true,
    hasStudentDeal: false,
    yesterdayOrders: 89,
    tags: ['健身轻食', '减脂', '低卡'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', // Salad
    description: '专注于低卡、高蛋白的健康饮食，所有食材均经过严格热量计算。',
    businessHours: '09:00 - 21:00',
    location: { lat: 39.98, lng: 116.31, address: '北京大学东门商业街2层' },
    savingTip: '办理周卡可享受8.5折优惠，适合长期健身的同学。',
    recommendedDishes: [
      { name: '香煎鸡胸肉沙拉', calories: 380, protein: 42, carbs: 15, fat: 12, price: 38, healthTags: ['低脂', '高蛋白', '低卡'] },
      { name: '牛油果大虾波奇饭', calories: 450, protein: 28, carbs: 40, fat: 18, price: 48, healthTags: ['优质脂肪', '轻食'] }
    ],
    menu: [
      { name: '香煎鸡胸肉沙拉', calories: 380, protein: 42, carbs: 15, fat: 12, price: 38, healthTags: ['低脂', '高蛋白', '低卡'] },
      { name: '牛油果大虾波奇饭', calories: 450, protein: 28, carbs: 40, fat: 18, price: 48, healthTags: ['优质脂肪', '轻食'] },
      { name: '烟熏三文鱼全麦卷', calories: 320, protein: 22, carbs: 30, fat: 14, price: 42, healthTags: ['低卡', '高蛋白'] },
      { name: '藜麦时蔬能量碗', calories: 280, protein: 12, carbs: 45, fat: 8, price: 35, healthTags: ['素食', '低卡'] }
    ]
  },
  {
    id: '3',
    name: '深夜食堂拉面',
    campus: '人大校区',
    category: '日式料理',
    avgPrice: 35,
    rating: 4.6,
    distance: 0.8,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 210,
    tags: ['夜宵续命', '一人食', '暖胃'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', // Ramen
    description: '浓郁的猪骨汤底，深夜里的一碗热拉面是赶论文时的最佳慰藉。',
    businessHours: '18:00 - 02:00',
    location: { lat: 39.97, lng: 116.33, address: '人民大学南路美食街' },
    savingTip: '晚上10点后第二碗半价，适合和室友一起拼单。',
    recommendedDishes: [
      { name: '博多豚骨拉面', calories: 850, protein: 25, carbs: 80, fat: 35, price: 32, healthTags: [] },
      { name: '地狱辣味拉面', calories: 820, protein: 24, carbs: 78, fat: 34, price: 35, healthTags: [] }
    ],
    menu: [
      { name: '博多豚骨拉面', calories: 850, protein: 25, carbs: 80, fat: 35, price: 32, healthTags: [] },
      { name: '地狱辣味拉面', calories: 820, protein: 24, carbs: 78, fat: 34, price: 35, healthTags: [] },
      { name: '日式煎饺', calories: 280, protein: 10, carbs: 30, fat: 12, price: 18, healthTags: [] },
      { name: '章鱼小丸子', calories: 320, protein: 8, carbs: 40, fat: 15, price: 22, healthTags: [] }
    ]
  },
  {
    id: '4',
    name: '图书馆咖啡吧',
    campus: '清华校区',
    category: '简餐咖啡',
    avgPrice: 30,
    rating: 4.3,
    distance: 0.1,
    isNew: false,
    isHealthyFriendly: true,
    hasStudentDeal: true,
    yesterdayOrders: 124,
    tags: ['图书馆速食', '学习氛围', '提神'],
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', // Coffee
    description: '位于图书馆一楼，提供快速便捷的简餐和高品质咖啡。',
    businessHours: '08:00 - 22:30',
    location: { lat: 39.991, lng: 116.321, address: '清华大学图书馆北馆1层' },
    savingTip: '自带杯购买咖啡立减5元，三明治+美式套餐仅需28元。',
    recommendedDishes: [
      { name: '全麦鸡肉三明治', calories: 320, protein: 18, carbs: 35, fat: 10, price: 22, healthTags: ['低卡', '轻食'] },
      { name: '燕麦拿铁', calories: 150, protein: 5, carbs: 20, fat: 6, price: 28, healthTags: ['低脂'] }
    ],
    menu: [
      { name: '全麦鸡肉三明治', calories: 320, protein: 18, carbs: 35, fat: 10, price: 22, healthTags: ['低卡', '轻食'] },
      { name: '燕麦拿铁', calories: 150, protein: 5, carbs: 20, fat: 6, price: 28, healthTags: ['低脂'] },
      { name: '美式咖啡', calories: 5, protein: 0, carbs: 1, fat: 0, price: 18, healthTags: ['零卡'] },
      { name: '蓝莓马芬', calories: 350, protein: 4, carbs: 45, fat: 18, price: 15, healthTags: [] }
    ]
  },
  {
    id: '5',
    name: '聚义厅火锅',
    campus: '北航校区',
    category: '四川火锅',
    avgPrice: 85,
    rating: 4.7,
    distance: 1.2,
    isNew: true,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 342,
    tags: ['朋友聚餐', '约会氛围', '热闹'],
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80', // Hotpot
    description: '正宗川味火锅，装修极具武侠风格，是社团聚餐的不二之选。',
    businessHours: '11:00 - 23:00',
    location: { lat: 39.985, lng: 116.34, address: '北航南门外商业广场3层' },
    savingTip: '凭学生证可享受菜品6.9折，生日当天赠送长寿面。',
    recommendedDishes: [
      { name: '麻辣锅底', calories: 1200, protein: 10, carbs: 20, fat: 110, price: 58, healthTags: [] },
      { name: '手切鲜羊肉', calories: 250, protein: 20, carbs: 0, fat: 18, price: 48, healthTags: ['高蛋白'] }
    ],
    menu: [
      { name: '麻辣锅底', calories: 1200, protein: 10, carbs: 20, fat: 110, price: 58, healthTags: [] },
      { name: '手切鲜羊肉', calories: 250, protein: 20, carbs: 0, fat: 18, price: 48, healthTags: ['高蛋白'] },
      { name: '极品肥牛', calories: 280, protein: 18, carbs: 0, fat: 22, price: 52, healthTags: ['高蛋白'] },
      { name: '功夫土豆片', calories: 120, protein: 2, carbs: 25, fat: 1, price: 12, healthTags: ['低脂'] }
    ]
  },
  {
    id: '6',
    name: '雨后森林西餐',
    campus: '北大校区',
    category: '西式料理',
    avgPrice: 120,
    rating: 4.9,
    distance: 0.6,
    isNew: false,
    isHealthyFriendly: true,
    hasStudentDeal: false,
    yesterdayOrders: 67,
    tags: ['约会氛围', '下雨天最近', '精致'],
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80', // Western food
    description: '环境优雅，充满森林气息，非常适合情侣约会或纪念日庆祝。',
    businessHours: '11:30 - 21:30',
    location: { lat: 39.982, lng: 116.315, address: '北大西门林荫道旁' },
    savingTip: '双人浪漫套餐比单点优惠50元，需提前预约。',
    recommendedDishes: [
      { name: '澳洲M5和牛牛排', calories: 550, protein: 45, carbs: 5, fat: 38, price: 188, healthTags: ['高蛋白', '增肌友好'] },
      { name: '黑松露野菇意面', calories: 480, protein: 12, carbs: 65, fat: 20, price: 68, healthTags: [] }
    ],
    menu: [
      { name: '澳洲M5和牛牛排', calories: 550, protein: 45, carbs: 5, fat: 38, price: 188, healthTags: ['高蛋白', '增肌友好'] },
      { name: '黑松露野菇意面', calories: 480, protein: 12, carbs: 65, fat: 20, price: 68, healthTags: [] },
      { name: '凯撒沙拉', calories: 220, protein: 8, carbs: 12, fat: 15, price: 45, healthTags: ['低卡'] },
      { name: '法式洋葱汤', calories: 180, protein: 6, carbs: 15, fat: 10, price: 32, healthTags: [] }
    ]
  },
  {
    id: '7',
    name: '川香阁',
    campus: '人大校区',
    category: '川菜',
    avgPrice: 40,
    rating: 4.4,
    distance: 0.4,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 198,
    tags: ['朋友聚餐', '宿舍外卖', '重口味'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&q=80', // Sichuan food
    description: '地道川菜，麻辣鲜香，分量十足。',
    businessHours: '10:30 - 22:00',
    location: { lat: 39.975, lng: 116.325, address: '人大东门美食街' },
    savingTip: '满50减10元，学生证9折。',
    recommendedDishes: [
      { name: '麻婆豆腐', calories: 350, protein: 15, carbs: 10, fat: 25, price: 18, healthTags: [] },
      { name: '回锅肉', calories: 580, protein: 22, carbs: 5, fat: 50, price: 38, healthTags: [] }
    ],
    menu: [
      { name: '麻婆豆腐', calories: 350, protein: 15, carbs: 10, fat: 25, price: 18, healthTags: [] },
      { name: '回锅肉', calories: 580, protein: 22, carbs: 5, fat: 50, price: 38, healthTags: [] },
      { name: '宫保鸡丁', calories: 450, protein: 25, carbs: 15, fat: 30, price: 32, healthTags: ['高蛋白'] },
      { name: '鱼香肉丝', calories: 420, protein: 20, carbs: 25, fat: 28, price: 28, healthTags: [] }
    ]
  },
  {
    id: '8',
    name: '老北京炸酱面',
    campus: '清华校区',
    category: '面食',
    avgPrice: 20,
    rating: 4.2,
    distance: 0.2,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 245,
    tags: ['一人食', '图书馆速食', '平价'],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80', // Noodles
    description: '传统手擀面，酱香浓郁，配菜丰富。',
    businessHours: '09:00 - 21:00',
    location: { lat: 39.992, lng: 116.322, address: '清华大学北门外' },
    savingTip: '加面免费，学生套餐仅需18元。',
    recommendedDishes: [
      { name: '招牌炸酱面', calories: 550, protein: 18, carbs: 85, fat: 15, price: 20, healthTags: [] }
    ],
    menu: [
      { name: '招牌炸酱面', calories: 550, protein: 18, carbs: 85, fat: 15, price: 20, healthTags: [] },
      { name: '打卤面', calories: 520, protein: 15, carbs: 80, fat: 12, price: 18, healthTags: [] },
      { name: '凉拌黄瓜', calories: 80, protein: 2, carbs: 5, fat: 6, price: 8, healthTags: ['低脂', '低卡'] }
    ]
  },
  {
    id: '9',
    name: '汉堡王',
    campus: '北航校区',
    category: '西式快餐',
    avgPrice: 35,
    rating: 4.1,
    distance: 0.5,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 312,
    tags: ['宿舍外卖', '图书馆速食', '快捷'],
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80', // Burger
    description: '火烤牛肉，多汁美味。',
    businessHours: '08:00 - 23:00',
    location: { lat: 39.986, lng: 116.341, address: '北航南门商业街' },
    savingTip: '周三会员日买一送一。',
    recommendedDishes: [
      { name: '皇堡', calories: 670, protein: 28, carbs: 49, fat: 38, price: 32, healthTags: [] }
    ],
    menu: [
      { name: '皇堡', calories: 670, protein: 28, carbs: 49, fat: 38, price: 32, healthTags: [] },
      { name: '薯条', calories: 320, protein: 3, carbs: 40, fat: 17, price: 12, healthTags: [] },
      { name: '可乐', calories: 150, protein: 0, carbs: 38, fat: 0, price: 10, healthTags: [] }
    ]
  },
  {
    id: '10',
    name: '泰好味',
    campus: '北大校区',
    category: '东南亚菜',
    avgPrice: 65,
    rating: 4.6,
    distance: 0.9,
    isNew: true,
    isHealthyFriendly: true,
    hasStudentDeal: false,
    yesterdayOrders: 145,
    tags: ['约会氛围', '朋友聚餐', '异域风情'],
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', // Thai food
    description: '正宗泰式料理，冬阴功汤酸辣开胃。',
    businessHours: '11:00 - 22:00',
    location: { lat: 39.981, lng: 116.312, address: '北大西门商业区' },
    savingTip: '新店开业8折优惠。',
    recommendedDishes: [
      { name: '冬阴功汤', calories: 280, protein: 12, carbs: 15, fat: 18, price: 48, healthTags: ['低卡'] },
      { name: '菠萝炒饭', calories: 520, protein: 15, carbs: 85, fat: 12, price: 42, healthTags: [] }
    ],
    menu: [
      { name: '冬阴功汤', calories: 280, protein: 12, carbs: 15, fat: 18, price: 48, healthTags: ['低卡'] },
      { name: '菠萝炒饭', calories: 520, protein: 15, carbs: 85, fat: 12, price: 42, healthTags: [] },
      { name: '泰式青木瓜沙拉', calories: 150, protein: 4, carbs: 20, fat: 6, price: 28, healthTags: ['低脂', '低卡'] }
    ]
  },
  {
    id: '11',
    name: '麻辣烫小站',
    campus: '人大校区',
    category: '小吃',
    avgPrice: 22,
    rating: 4.3,
    distance: 0.3,
    isNew: false,
    isHealthyFriendly: true,
    hasStudentDeal: true,
    yesterdayOrders: 278,
    tags: ['一人食', '夜宵续命', '平价'],
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=80', // Malatang
    description: '自选食材，多种汤底可选。',
    businessHours: '10:00 - 00:00',
    location: { lat: 39.976, lng: 116.326, address: '人大西门美食街' },
    savingTip: '称重计费，满20元送饮料。',
    recommendedDishes: [
      { name: '自选麻辣烫', calories: 450, protein: 25, carbs: 30, fat: 20, price: 25, healthTags: ['高蛋白', '多蔬菜'] }
    ]
  },
  {
    id: '12',
    name: '韩式炸鸡屋',
    campus: '清华校区',
    category: '韩式料理',
    avgPrice: 50,
    rating: 4.5,
    distance: 0.7,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: false,
    yesterdayOrders: 167,
    tags: ['宿舍外卖', '朋友聚餐', '解馋'],
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80', // Fried chicken
    description: '外酥里嫩，多种酱料可选。',
    businessHours: '11:00 - 23:00',
    location: { lat: 39.993, lng: 116.323, address: '清华东门外' },
    savingTip: '双人套餐更划算。',
    recommendedDishes: [
      { name: '蜂蜜芥末炸鸡', calories: 880, protein: 35, carbs: 45, fat: 60, price: 58, healthTags: [] }
    ]
  },
  {
    id: '13',
    name: '素食坊',
    campus: '北大校区',
    category: '素食',
    avgPrice: 35,
    rating: 4.7,
    distance: 0.4,
    isNew: false,
    isHealthyFriendly: true,
    hasStudentDeal: true,
    yesterdayOrders: 92,
    tags: ['健康轻食', '减脂', '清淡'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', // Veggie
    description: '纯天然食材，健康美味。',
    businessHours: '10:00 - 21:00',
    location: { lat: 39.983, lng: 116.313, address: '北大校内餐饮中心' },
    savingTip: '学生证8.5折。',
    recommendedDishes: [
      { name: '五彩拌饭', calories: 320, protein: 10, carbs: 60, fat: 5, price: 28, healthTags: ['低脂', '低卡'] }
    ]
  },
  {
    id: '14',
    name: '新疆大串',
    campus: '北航校区',
    category: '烧烤',
    avgPrice: 55,
    rating: 4.4,
    distance: 0.8,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: false,
    yesterdayOrders: 423,
    tags: ['夜宵续命', '朋友聚餐', '肉食动物'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', // BBQ
    description: '正宗红柳大串，肉质鲜嫩。',
    businessHours: '17:00 - 02:00',
    location: { lat: 39.987, lng: 116.342, address: '北航东门外' },
    savingTip: '买10串送1串。',
    recommendedDishes: [
      { name: '红柳烤羊肉', calories: 150, protein: 15, carbs: 0, fat: 10, price: 12, healthTags: ['高蛋白'] }
    ]
  },
  {
    id: '15',
    name: '港式茶餐厅',
    campus: '人大校区',
    category: '粤菜',
    avgPrice: 60,
    rating: 4.5,
    distance: 0.6,
    isNew: true,
    isHealthyFriendly: true,
    hasStudentDeal: false,
    yesterdayOrders: 134,
    tags: ['约会氛围', '朋友聚餐', '精致'],
    image: 'https://images.unsplash.com/photo-1583182332473-b31ba08929c8?w=600&q=80', // HK food
    description: '经典港式点心，丝滑奶茶。',
    businessHours: '08:00 - 22:00',
    location: { lat: 39.977, lng: 116.327, address: '人大北门外' },
    savingTip: '下午茶时段套餐6折。',
    recommendedDishes: [
      { name: '水晶虾饺', calories: 180, protein: 10, carbs: 25, fat: 5, price: 28, healthTags: ['低脂'] },
      { name: '冰镇奶茶', calories: 250, protein: 3, carbs: 40, fat: 8, price: 18, healthTags: [] }
    ]
  },
  {
    id: '16',
    name: '老西安肉夹馍',
    campus: '清华校区',
    category: '小吃',
    avgPrice: 18,
    rating: 4.3,
    distance: 0.2,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 289,
    tags: ['一人食', '图书馆速食', '平价'],
    image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=600&q=80', // Roujiamo
    description: '饼酥肉香，肥而不腻。',
    businessHours: '07:00 - 21:00',
    location: { lat: 39.994, lng: 116.324, address: '清华西门商业街' },
    savingTip: '肉夹馍+凉皮套餐仅需25元。',
    recommendedDishes: [
      { name: '腊汁肉夹馍', calories: 420, protein: 18, carbs: 45, fat: 20, price: 12, healthTags: [] }
    ]
  },
  {
    id: '17',
    name: '意式披萨屋',
    campus: '北大校区',
    category: '西式料理',
    avgPrice: 75,
    rating: 4.6,
    distance: 1.1,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 178,
    tags: ['朋友聚餐', '宿舍外卖', '聚会'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80', // Pizza
    description: '薄底披萨，芝士浓郁。',
    businessHours: '11:00 - 22:00',
    location: { lat: 39.984, lng: 116.314, address: '北大东门外' },
    savingTip: '凭学生证披萨买一送一。',
    recommendedDishes: [
      { name: '玛格丽特披萨', calories: 850, protein: 35, carbs: 110, fat: 30, price: 68, healthTags: [] }
    ]
  },
  {
    id: '18',
    name: '潮汕牛肉火锅',
    campus: '北航校区',
    category: '火锅',
    avgPrice: 95,
    rating: 4.8,
    distance: 1.5,
    isNew: false,
    isHealthyFriendly: true,
    hasStudentDeal: false,
    yesterdayOrders: 256,
    tags: ['朋友聚餐', '健身轻食', '高品质'],
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80', // Beef hotpot
    description: '鲜切牛肉，清汤锅底，原汁原味。',
    businessHours: '11:00 - 22:00',
    location: { lat: 39.988, lng: 116.343, address: '北航北门外' },
    savingTip: '午市菜品8折。',
    recommendedDishes: [
      { name: '吊龙肉', calories: 180, protein: 25, carbs: 0, fat: 8, price: 42, healthTags: ['高蛋白', '低脂'] }
    ]
  },
  {
    id: '19',
    name: '兰州拉面',
    campus: '人大校区',
    category: '面食',
    avgPrice: 15,
    rating: 4.1,
    distance: 0.1,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 512,
    tags: ['一人食', '平价', '快捷'],
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=600&q=80', // Lanzhou noodles
    description: '一清二白三红四绿五黄。',
    businessHours: '06:00 - 23:00',
    location: { lat: 39.978, lng: 116.328, address: '人大南门外' },
    savingTip: '加面免费。',
    recommendedDishes: [
      { name: '牛肉拉面', calories: 520, protein: 20, carbs: 80, fat: 12, price: 15, healthTags: [] }
    ]
  },
  {
    id: '20',
    name: '粥店',
    campus: '清华校区',
    category: '中式快餐',
    avgPrice: 28,
    rating: 4.4,
    distance: 0.4,
    isNew: false,
    isHealthyFriendly: true,
    hasStudentDeal: true,
    yesterdayOrders: 143,
    tags: ['一人食', '暖胃', '健康轻食'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', // Porridge
    description: '各种养生粥品，清淡适口。',
    businessHours: '07:00 - 22:00',
    location: { lat: 39.995, lng: 116.325, address: '清华校内食堂' },
    savingTip: '学生卡消费9折。',
    recommendedDishes: [
      { name: '皮蛋瘦肉粥', calories: 250, protein: 12, carbs: 40, fat: 5, price: 12, healthTags: ['低脂'] }
    ]
  },
  {
    id: '21',
    name: '云南过桥米线',
    campus: '北大校区',
    category: '面食',
    avgPrice: 32,
    rating: 4.5,
    distance: 0.5,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 187,
    tags: ['一人食', '暖胃', '宿舍外卖'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd242959b4fe?w=600&q=80', // Rice noodles
    description: '汤鲜味美，配料丰富。',
    businessHours: '10:00 - 22:00',
    location: { lat: 39.985, lng: 116.315, address: '北大西门外' },
    savingTip: '满30减5元。',
    recommendedDishes: [
      { name: '招牌过桥米线', calories: 620, protein: 22, carbs: 85, fat: 18, price: 32, healthTags: [] }
    ]
  },
  {
    id: '22',
    name: '东北饺子馆',
    campus: '北航校区',
    category: '中式快餐',
    avgPrice: 30,
    rating: 4.3,
    distance: 0.6,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 234,
    tags: ['一人食', '朋友聚餐', '平价'],
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&q=80', // Dumplings
    description: '皮薄馅大，手工现包。',
    businessHours: '10:00 - 21:30',
    location: { lat: 39.989, lng: 116.344, address: '北航南门外' },
    savingTip: '每满30个送凉菜一份。',
    recommendedDishes: [
      { name: '猪肉大葱水饺', calories: 480, protein: 20, carbs: 60, fat: 18, price: 25, healthTags: [] }
    ]
  },
  {
    id: '23',
    name: '印度咖喱屋',
    campus: '人大校区',
    category: '异域风情',
    avgPrice: 70,
    rating: 4.4,
    distance: 1.2,
    isNew: true,
    isHealthyFriendly: false,
    hasStudentDeal: false,
    yesterdayOrders: 112,
    tags: ['朋友聚餐', '重口味', '异域风情'],
    image: 'https://images.unsplash.com/photo-1585937421612-70a0f295561a?w=600&q=80', // Curry
    description: '浓郁咖喱，香脆烤饼。',
    businessHours: '11:00 - 21:30',
    location: { lat: 39.979, lng: 116.329, address: '人大东门外' },
    savingTip: '新店开业全场8.8折。',
    recommendedDishes: [
      { name: '黄油鸡咖喱', calories: 550, protein: 30, carbs: 15, fat: 42, price: 58, healthTags: [] }
    ]
  },
  {
    id: '24',
    name: '上海生煎包',
    campus: '清华校区',
    category: '小吃',
    avgPrice: 22,
    rating: 4.5,
    distance: 0.3,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 367,
    tags: ['一人食', '图书馆速食', '平价'],
    image: 'https://images.unsplash.com/photo-1626199057193-02ec8a71246c?w=600&q=80', // Shengjianbao
    description: '底脆肉鲜，汤汁浓郁。',
    businessHours: '07:00 - 20:00',
    location: { lat: 39.996, lng: 116.326, address: '清华东门商业街' },
    savingTip: '买4个送1个。',
    recommendedDishes: [
      { name: '招牌生煎包', calories: 380, protein: 15, carbs: 40, fat: 18, price: 12, healthTags: [] }
    ]
  },
  {
    id: '25',
    name: '法式甜品店',
    campus: '北大校区',
    category: '甜品',
    avgPrice: 55,
    rating: 4.8,
    distance: 0.8,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: false,
    yesterdayOrders: 88,
    tags: ['约会氛围', '精致', '下午茶'],
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', // Cake
    description: '精致甜点，浪漫午后。',
    businessHours: '10:00 - 20:00',
    location: { lat: 39.986, lng: 116.316, address: '北大未名湖畔' },
    savingTip: '生日预订蛋糕9折。',
    recommendedDishes: [
      { name: '草莓慕斯', calories: 350, protein: 5, carbs: 45, fat: 18, price: 38, healthTags: [] }
    ]
  },
  {
    id: '26',
    name: '广式烧腊',
    campus: '北航校区',
    category: '粤菜',
    avgPrice: 38,
    rating: 4.4,
    distance: 0.4,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 156,
    tags: ['一人食', '宿舍外卖', '平价'],
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80', // Roast duck
    description: '皮脆肉嫩，酱汁入味。',
    businessHours: '10:30 - 21:00',
    location: { lat: 39.99, lng: 116.345, address: '北航校内食堂' },
    savingTip: '学生卡消费立减2元。',
    recommendedDishes: [
      { name: '深井烧鹅饭', calories: 750, protein: 28, carbs: 65, fat: 42, price: 35, healthTags: [] }
    ]
  },
  {
    id: '27',
    name: '土耳其烤肉',
    campus: '人大校区',
    category: '异域风情',
    avgPrice: 25,
    rating: 4.2,
    distance: 0.2,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 456,
    tags: ['一人食', '图书馆速食', '快捷'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', // Kebab
    description: '大口吃肉，满足感爆棚。',
    businessHours: '10:00 - 22:00',
    location: { lat: 39.98, lng: 116.33, address: '人大西门外' },
    savingTip: '加肉仅需5元。',
    recommendedDishes: [
      { name: '烤肉夹馍', calories: 580, protein: 32, carbs: 48, fat: 28, price: 18, healthTags: ['高蛋白'] }
    ]
  },
  {
    id: '28',
    name: '老成都串串香',
    campus: '清华校区',
    category: '火锅',
    avgPrice: 65,
    rating: 4.6,
    distance: 0.9,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 321,
    tags: ['朋友聚餐', '夜宵续命', '重口味'],
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80', // Chuanchuan
    description: '麻辣鲜香，越吃越过瘾。',
    businessHours: '11:00 - 01:00',
    location: { lat: 39.997, lng: 116.327, address: '清华南门外' },
    savingTip: '签子称重，学生证8.8折。',
    recommendedDishes: [
      { name: '麻辣牛肉串', calories: 80, protein: 8, carbs: 1, fat: 5, price: 1, healthTags: [] }
    ]
  },
  {
    id: '29',
    name: '精品湘菜',
    campus: '北大校区',
    category: '湘菜',
    avgPrice: 55,
    rating: 4.5,
    distance: 0.7,
    isNew: false,
    isHealthyFriendly: false,
    hasStudentDeal: false,
    yesterdayOrders: 198,
    tags: ['朋友聚餐', '重口味', '下饭'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&q=80', // Hunan food
    description: '香辣可口，米饭杀手。',
    businessHours: '11:00 - 22:00',
    location: { lat: 39.987, lng: 116.317, address: '北大东门外' },
    savingTip: '满100减20元。',
    recommendedDishes: [
      { name: '剁椒鱼头', calories: 450, protein: 45, carbs: 5, fat: 28, price: 68, healthTags: ['高蛋白'] }
    ]
  },
  {
    id: '30',
    name: '深夜炸串',
    campus: '北航校区',
    category: '小吃',
    avgPrice: 35,
    rating: 4.3,
    distance: 0.5,
    isNew: true,
    isHealthyFriendly: false,
    hasStudentDeal: true,
    yesterdayOrders: 567,
    tags: ['夜宵续命', '宿舍外卖', '解馋'],
    image: 'https://images.unsplash.com/photo-1562607378-27b1bd99326c?w=600&q=80', // Fried skewers
    description: '万物皆可炸，深夜最香。',
    businessHours: '18:00 - 03:00',
    location: { lat: 39.991, lng: 116.346, address: '北航西门外' },
    savingTip: '满30元送炸馒头片。',
    recommendedDishes: [
      { name: '炸鸡柳', calories: 650, protein: 25, carbs: 40, fat: 45, price: 15, healthTags: [] }
    ]
  }
];

export const MEAL_PLANS: MealPlan[] = [
  {
    day: '周一',
    meals: [
      { type: '早餐', dishName: '燕麦拿铁 + 全麦三明治', restaurantName: '图书馆咖啡吧', calories: 470, budget: 50, reason: '开启元气满满的一周，低卡饱腹感强。' },
      { type: '午餐', dishName: '香煎鸡胸肉沙拉', restaurantName: '绿野轻食社', calories: 380, budget: 38, reason: '高蛋白午餐，避免下午上课犯困。' },
      { type: '晚餐', dishName: '招牌黄焖鸡(少饭)', restaurantName: '学子居黄焖鸡', calories: 550, budget: 22, reason: '平价美味，补充体力。' }
    ]
  },
  {
    day: '周二',
    meals: [
      { type: '早餐', dishName: '全麦鸡肉三明治', restaurantName: '图书馆咖啡吧', calories: 320, budget: 22, reason: '快速便捷，适合早八人。' },
      { type: '午餐', dishName: '牛油果大虾波奇饭', restaurantName: '绿野轻食社', calories: 450, budget: 48, reason: '优质脂肪摄入，营养均衡。' },
      { type: '晚餐', dishName: '博多豚骨拉面', restaurantName: '深夜食堂拉面', calories: 850, budget: 32, reason: '辛苦一天后的奖励。' }
    ]
  }
];
