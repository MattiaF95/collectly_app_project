export interface User {
  _id?: string;
  email: string;
  username: string;
  password?: string;
  createdAt?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  currency: string;
  measureUnit: 'cm' | 'inch';
}
