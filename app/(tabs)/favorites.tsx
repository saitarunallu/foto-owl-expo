import React, { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { CustomInput, EmptyState, ImageCard } from '@/components/ui';

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favorites } = useApp();
  const [search, setSearch] = useState('');
  const visibleFavorites = useMemo(() => {
    const query = search.trim().toLowerCase();
    return favorites.filter((image) => !query || image.author.toLowerCase().includes(query));
  }, [favorites, search]);
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top + 16, Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.accent }]}>YOUR COLLECTION</Text><Text style={[styles.title, { color: colors.foreground }]}>Favorites</Text><Text style={{ color: colors.mutedForeground }}>{favorites.length} {favorites.length === 1 ? 'image' : 'images'} saved</Text></View>
      {favorites.length > 0 ? <View style={styles.search}><CustomInput label="" value={search} onChangeText={setSearch} placeholder="Search favorites by author" /></View> : null}
      {favorites.length === 0 ? <EmptyState icon="heart" title="No favorite images yet." description="Tap the heart on any image to save it here." /> : visibleFavorites.length === 0 ? <EmptyState icon="search" title="No matches" description="Try a different author name." /> : <FlatList data={visibleFavorites} numColumns={2} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <ImageCard image={item} onPress={() => router.push({ pathname: '/detail', params: { image: JSON.stringify(item) } })} />} />}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, paddingHorizontal: 16, paddingTop: 57 }, heading: { gap: 6, marginBottom: 16 }, eyebrow: { fontSize: 11, letterSpacing: 1.7, fontWeight: '800' }, title: { fontSize: 30, fontWeight: '700' }, search: { marginBottom: 10 }, list: { paddingBottom: 92 } });