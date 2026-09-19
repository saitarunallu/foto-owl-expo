export type Gender = 'Male' | 'Female' | 'Other';
export type GalleryFilter = 'all' | 'am' | 'nz';
export type ThemeMode = 'light' | 'dark';

export interface User {
  fullName: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
  password: string;
}

export interface FotoImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface AppContextValue {
  user: User | null;
  isLoggedIn: boolean;
  favorites: FotoImage[];
  theme: ThemeMode;
  ready: boolean;
  registerUser: (user: User) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  toggleFavorite: (image: FotoImage) => Promise<void>;
  isFavorite: (id: string) => boolean;
  setTheme: (theme: ThemeMode) => Promise<void>;
}