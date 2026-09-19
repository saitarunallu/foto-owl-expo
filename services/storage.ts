import AsyncStorage from '@react-native-async-storage/async-storage';
import { FotoImage, ThemeMode, User } from '@/types';

const KEYS = {
  user: '@foto-owl/registered-user',
  session: '@foto-owl/session',
  favorites: '@foto-owl/favorites',
  theme: '@foto-owl/theme',
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUser: () => readJson<User | null>(KEYS.user, null),
  saveUser: (user: User) => writeJson(KEYS.user, user),
  getSession: () => readJson<boolean>(KEYS.session, false),
  saveSession: (value: boolean) => writeJson(KEYS.session, value),
  getFavorites: () => readJson<FotoImage[]>(KEYS.favorites, []),
  saveFavorites: (images: FotoImage[]) => writeJson(KEYS.favorites, images),
  getTheme: () => readJson<ThemeMode>(KEYS.theme, 'light'),
  saveTheme: (theme: ThemeMode) => writeJson(KEYS.theme, theme),
};