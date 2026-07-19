export interface School {
  id: number;
  name: string;
  code: string;
  city: string;
  state: string;
  students: number;
  teachers: number;
  status: 'active' | 'inactive' | 'pending';
  subscription: 'premium' | 'standard' | 'basic';
  joinedDate: string;
  revenue: number;
}

export const schools: School[] = [
  { id: 1, name: 'Green Valley School', code: 'GVS', city: 'Mumbai', state: 'Maharashtra', students: 2450, teachers: 120, status: 'active', subscription: 'premium', joinedDate: '2020-06-15', revenue: 45000 },
  { id: 2, name: 'Sunshine Public School', code: 'SPS', city: 'Delhi', state: 'Delhi', students: 1800, teachers: 95, status: 'active', subscription: 'premium', joinedDate: '2019-03-10', revenue: 45000 },
  { id: 3, name: 'DPS International', code: 'DPS', city: 'Bangalore', state: 'Karnataka', students: 2200, teachers: 110, status: 'active', subscription: 'standard', joinedDate: '2021-01-20', revenue: 35000 },
  { id: 4, name: 'Bright Future Academy', code: 'BFA', city: 'Pune', state: 'Maharashtra', students: 950, teachers: 55, status: 'active', subscription: 'standard', joinedDate: '2022-04-05', revenue: 25000 },
  { id: 5, name: 'Oxford Public School', code: 'OPS', city: 'Hyderabad', state: 'Telangana', students: 1600, teachers: 85, status: 'active', subscription: 'premium', joinedDate: '2020-09-12', revenue: 40000 },
  { id: 6, name: 'Nalanda International', code: 'NIS', city: 'Chennai', state: 'Tamil Nadu', students: 1300, teachers: 70, status: 'active', subscription: 'standard', joinedDate: '2021-07-18', revenue: 30000 },
  { id: 7, name: 'St. Marys Academy', code: 'SMA', city: 'Kolkata', state: 'West Bengal', students: 1100, teachers: 60, status: 'active', subscription: 'basic', joinedDate: '2022-11-30', revenue: 20000 },
  { id: 8, name: 'Delhi Public School', code: 'DPS2', city: 'Jaipur', state: 'Rajasthan', students: 2800, teachers: 135, status: 'active', subscription: 'premium', joinedDate: '2018-05-22', revenue: 52000 },
  { id: 9, name: 'Ryan International', code: 'RIS', city: 'Ahmedabad', state: 'Gujarat', students: 1700, teachers: 88, status: 'active', subscription: 'standard', joinedDate: '2021-02-14', revenue: 35000 },
  { id: 10, name: 'Lotus Valley School', code: 'LVS', city: 'Lucknow', state: 'Uttar Pradesh', students: 850, teachers: 48, status: 'inactive', subscription: 'basic', joinedDate: '2023-06-01', revenue: 15000 },
  { id: 11, name: 'Euro International', code: 'EIS', city: 'Surat', state: 'Gujarat', students: 1200, teachers: 65, status: 'active', subscription: 'standard', joinedDate: '2022-08-19', revenue: 28000 },
  { id: 12, name: 'Heritage School', code: 'HS', city: 'Chandigarh', state: 'Punjab', students: 980, teachers: 52, status: 'active', subscription: 'basic', joinedDate: '2023-01-10', revenue: 18000 },
  { id: 13, name: 'Vibgyor High', code: 'VH', city: 'Indore', state: 'Madhya Pradesh', students: 750, teachers: 42, status: 'pending', subscription: 'basic', joinedDate: '2024-03-25', revenue: 12000 },
  { id: 14, name: 'Global Indian School', code: 'GIS', city: 'Bhopal', state: 'Madhya Pradesh', students: 1400, teachers: 72, status: 'active', subscription: 'standard', joinedDate: '2021-11-08', revenue: 32000 },
  { id: 15, name: 'Podar International', code: 'PIS', city: 'Nagpur', state: 'Maharashtra', students: 1050, teachers: 58, status: 'active', subscription: 'basic', joinedDate: '2022-05-15', revenue: 22000 },
];
