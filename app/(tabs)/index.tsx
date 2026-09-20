import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { ChoicePill, EmptyState, ImageCard, LoadingIndicator } from '@/components/ui';
import { FotoImage, GalleryFilter } from '@/types';

const API_URL = 'https://picsum.photos/v2/list?page=1&limit=50';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState<FotoImage[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [sort, setSort] = useState<'az' | 'za'>('az');
  const [visibleCount, setVisibleCount] = useState(16);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadImages = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Unable to fetch images');
      const data = (await response.json()) as FotoImage[];
      setImages(data);
      setVisibleCount(16);
    } catch {
      setError('We could not load the gallery right now. Check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadImages(); }, [loadImages]);

  const filteredImages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return images.filter((image) => {
      const matchesSearch = !query || image.author.toLowerCase().includes(query);
      const first = image.author.trim().charAt(0).toLowerCase();
      const matchesFilter = filter === 'all' || (filter === 'am' ? first >= 'a' && first <= 'm' : first >= 'n' && first <= 'z');
      return matchesSearch && matchesFilter;
    }).sort((first, second) => {
      const comparison = first.author.localeCompare(second.author);
      return sort === 'az' ? comparison : -comparison;
    }).slice(0, visibleCount);
  }, [filter, images, search, sort, visibleCount]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top + 16, Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.accent }]}>FOTO OWL / EXPLORE</Text><Text style={[styles.title, { color: colors.foreground }]}>Find your next favorite.</Text></View><View style={[styles.headerIcon, { backgroundColor: colors.secondary }]}><Feather name="aperture" size={20} color={colors.primary} /></View></View>
      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          accessibilityLabel="Search by author"
          value={search}
          onChangeText={setSearch}
          placeholder="Search by author"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          underlineColorAndroid="transparent"
          textAlignVertical="center"
          style={[styles.searchInput, { color: colors.foreground }]}
        />
      </View>
      <View style={styles.filters}>{[['all', 'All images'], ['am', 'Author A–M'], ['nz', 'Author N–Z']].map(([value, label]) => <ChoicePill key={value} label={label} selected={filter === value} onPress={() => { setFilter(value as GalleryFilter); setVisibleCount(16); }} />)}</View>
      <View style={styles.sortRow}><Text style={[styles.sortLabel, { color: colors.mutedForeground }]}>Sort by author</Text><ChoicePill label="A–Z" selected={sort === 'az'} onPress={() => setSort('az')} /><ChoicePill label="Z–A" selected={sort === 'za'} onPress={() => setSort('za')} /></View>
      {loading ? <LoadingIndicator /> : error ? <EmptyState icon="wifi-off" title="Gallery unavailable" description={error} action={{ label: 'Try again', onPress: () => void loadImages() }} /> : images.length === 0 ? <EmptyState title="No images found" description="The gallery returned no photos." /> : filteredImages.length === 0 ? <EmptyState icon="search" title="No matches" description="Try another author or filter." /> : (
        <FlatList data={filteredImages} keyExtractor={(item) => item.id} numColumns={2} contentContainerStyle={styles.list} columnWrapperStyle={styles.column} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadImages(true)} tintColor={colors.accent} />} onEndReached={() => { if (visibleCount < images.length) setVisibleCount((count) => Math.min(count + 12, images.length)); }} onEndReachedThreshold={0.6} ListFooterComponent={visibleCount < images.length ? <View style={styles.footer}><ActivityIndicator color={colors.accent} /><Text style={{ color: colors.mutedForeground }}>Loading more</Text></View> : null} renderItem={({ item }) => <ImageCard image={item} onPress={() => router.push({ pathname: '/detail', params: { image: JSON.stringify(item) } })} />} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 57 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, fontWeight: '800', marginBottom: 7 },
  title: { fontSize: 25, lineHeight: 30, fontWeight: '700', letterSpacing: -0.5, maxWidth: 290 },
  headerIcon: { height: 43, width: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14, borderRadius: 15, borderWidth: 1, height: 56, marginBottom: 13 },
  searchInput: { flex: 1, minWidth: 0, height: 54, paddingHorizontal: 0, paddingVertical: 0, fontSize: 15, lineHeight: 20, includeFontPadding: false },
  filters: { flexDirection: 'row', gap: 7, marginBottom: 9 },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 7 },
  sortLabel: { fontSize: 12, fontWeight: '600', marginRight: 2 },
  list: { paddingBottom: 92, paddingTop: 3 },
  column: { gap: 0 },
  footer: { alignItems: 'center', gap: 7, padding: 18 },
});
