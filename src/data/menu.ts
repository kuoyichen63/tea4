export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
};

export const MENU_CATEGORIES = ['蜜果四季青', '港港好無咖啡因'];

export const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: '阿嬤慢熬鳳梨四季青茶', description: '招牌！慢火慢熬古早味', price: 55, category: '蜜果四季青' },
  { id: '2', name: '霧梅四季青', description: '梅嶺直送重磅加入三顆梅', price: 60, category: '蜜果四季青' },
  { id: '3', name: '鮮甘蔗四季青', description: '甘蔗頭原汁與青茶1:1比例', price: 65, category: '蜜果四季青' },
  { id: '4', name: '蜜柑四季青', description: '茂谷柑原汁非濃縮還原果汁', price: 70, category: '蜜果四季青' },
  { id: '5', name: '百香鮮柑四季青', description: '埔里百香果與茶湯香醇結合', price: 70, category: '蜜果四季青' },
  { id: '6', name: '有機檸冬四季青', description: '古法熬煮有多瓜塊', price: 70, category: '蜜果四季青' },

  { id: '7', name: '阿嬤慢熬鳳梨冰茶', description: '招牌！慢火慢熬古早味', price: 50, category: '港港好無咖啡因' },
  { id: '8', name: '阿嬤慢熬鳳梨醇奶', description: '', price: 70, category: '港港好無咖啡因' },
  { id: '9', name: '黑糖珍珠醇奶', description: '手熬黑糖漿健康美味', price: 70, category: '港港好無咖啡因' },
  { id: '10', name: '有機小農檸檬汁', description: '有機檸檬美味滋味', price: 65, category: '港港好無咖啡因' },
  { id: '11', name: '有機檸檬鳳梨凍', description: '有機檸檬加上自製鳳梨凍', price: 70, category: '港港好無咖啡因' },
  { id: '12', name: '南非國寶茶那堤', description: '南非的紅寶石-無咖啡因', price: 70, category: '港港好無咖啡因' },
  { id: '13', name: '南非國寶茶有機檸', description: '南非的紅寶石-無咖啡因', price: 70, category: '港港好無咖啡因' },
];
