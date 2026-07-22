import { CafeteriaData } from '../types';

export const defaultMenuData: CafeteriaData = {
  dateString: 'Tuesday, July 22, 2026',
  isPublished: true,
  categories: [
    {
      title: 'Breakfast',
      icon: 'Sun',
      timeSlot: '7:30 AM - 8:30 AM',
      items: ['Idli & Sambar'],
    },
    {
      title: 'Lunch',
      icon: 'Utensils',
      timeSlot: '12:00 PM - 1:30 PM',
      items: ['Rice', 'Dal', 'Vegetable Curry', 'Curd'],
    },
    {
      title: 'Snacks',
      icon: 'Coffee',
      timeSlot: '4:00 PM - 4:45 PM',
      items: ['Banana', 'Milk'],
    },
  ],
  stats: {
    mealsServed: 1742,
    mealsTotal: 1850,
    nutritionScore: 95,
    status: 'Serving Lunch',
  },
};
