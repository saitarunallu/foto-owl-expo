import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform } from 'react-native';
import { AppContextValue, FotoImage, ThemeMode, User } from '@/types';
import { storage } from '@/services/storage';

const AppContext = createContext<AppContextValue | undefined>(undefined);

function applyNativeTheme(theme: ThemeMode) {
  if (Platform.OS !== 'web' && typeof Appearance.setColorScheme === 'function') {
    Appearance.setColorScheme(theme);
  }
}

export function AppProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState<FotoImage[]>([]);
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restore() {
      const [savedUser, session, savedFavorites, savedTheme] = await Promise.all([
        storage.getUser(),
        storage.getSession(),
        storage.getFavorites(),
        storage.getTheme(),
      ]);
      setUser(savedUser);
      setIsLoggedIn(session && !!savedUser);
      setFavorites(savedFavorites);
      setThemeState(savedTheme);
      applyNativeTheme(savedTheme);
      setReady(true);
    }
    void restore();
  }, []);

  const registerUser = async (newUser: User) => {
    await storage.saveUser(newUser);
    await storage.saveSession(false);
    setUser(newUser);
    setIsLoggedIn(false);
  };

  const login = async (email: string, password: string) => {
    const savedUser = await storage.getUser();
    const success = !!savedUser && savedUser.email.toLowerCase() === email.trim().toLowerCase() && savedUser.password === password;
    if (success) {
      setUser(savedUser);
      setIsLoggedIn(true);
      await storage.saveSession(true);
    }
    return success;
  };

  const logout = async () => {
    await storage.saveSession(false);
    setIsLoggedIn(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updates };
    await storage.saveUser(nextUser);
    setUser(nextUser);
  };

  const toggleFavorite = async (image: FotoImage) => {
    const exists = favorites.some((favorite) => favorite.id === image.id);
    const nextFavorites = exists
      ? favorites.filter((favorite) => favorite.id !== image.id)
      : [...favorites, image];
    setFavorites(nextFavorites);
    await storage.saveFavorites(nextFavorites);
  };

  const setTheme = async (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    applyNativeTheme(nextTheme);
    await storage.saveTheme(nextTheme);
  };

  const value = useMemo<AppContextValue>(() => ({
    user,
    isLoggedIn,
    favorites,
    theme,
    ready,
    registerUser,
    login,
    logout,
    updateProfile,
    toggleFavorite,
    isFavorite: (id: string) => favorites.some((favorite) => favorite.id === id),
    setTheme,
  }), [favorites, isLoggedIn, ready, theme, user]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}