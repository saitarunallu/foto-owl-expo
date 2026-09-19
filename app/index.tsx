import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function EntryScreen() {
  const colors = useColors();
  const { ready, isLoggedIn } = useApp();
  if (!ready) return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.accent} size="large" /></View>;
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center' } });