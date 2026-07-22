export type Role = 'student' | 'parent';

export interface MenuItem {
  id: string;
  name: string;
  iconName: string;
  category: 'breakfast' | 'lunch' | 'snacks';
  calories?: number;
  tags?: string[];
}

export interface MealCategory {
  title: 'Breakfast' | 'Lunch' | 'Snacks';
  icon: string;
  items: string[];
  timeSlot: string;
}

export interface KitchenStats {
  mealsServed: number;
  mealsTotal: number;
  nutritionScore: number;
  status: 'Serving Breakfast' | 'Serving Lunch' | 'Serving Snacks' | 'Kitchen Closed';
}

export interface CafeteriaData {
  dateString: string;
  isPublished: boolean;
  categories: MealCategory[];
  stats: KitchenStats;
}
