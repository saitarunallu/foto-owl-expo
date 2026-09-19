import React, { useState } from 'react';
import { Alert, Image, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { CustomButton, LoadingIndicator } from '@/components/ui';
import { FotoImage } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { image: rawImage } = useLocalSearchParams<{ image?: string }>();
  const { isFavorite, toggleFavorite, ready, isLoggedIn } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  if (!ready) return <LoadingIndicator />;
  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;
  if (!rawImage) return <LoadingIndicator />;
  let image: FotoImage;
  try { image = JSON.parse(rawImage); } catch { return <LoadingIndicator label="Image unavailable" />; }
  const favorite = isFavorite(image.id);

  async function downloadImage() {
    if (Platform.OS === 'web') { Alert.alert('Device download', 'Gallery saving is available in the Expo mobile app.'); return; }
    setDownloading(true);
    try {
      const MediaLibrary = await import('expo-media-library/legacy');
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) { Alert.alert('Permission needed', 'Allow gallery access to save this image.'); return; }
      const target = new File(Paths.cache, `foto-owl-${image.id}.jpg`);
      const result = await File.downloadFileAsync(image.download_url, target, { idempotent: true });
      await MediaLibrary.createAssetAsync(result.uri);
      Alert.alert('Saved to gallery', 'The image is now in your device gallery.');
    } catch { Alert.alert('Download failed', 'We could not save this image. Please try again.'); } finally { setDownloading(false); }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 10, Platform.OS === 'web' ? 67 : 0) }]}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.card }]}><Feather name="arrow-left" size={20} color={colors.foreground} /></Pressable><Text style={[styles.topTitle, { color: colors.foreground }]}>Image details</Text><Pressable accessibilityRole="button" accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'} onPress={() => void toggleFavorite(image)} style={[styles.iconButton, { backgroundColor: colors.card }]}><Feather name="heart" size={19} color={favorite ? colors.destructive : colors.foreground} fill={favorite ? colors.destructive : 'none'} /></Pressable></View>
      <Pressable onPress={() => setViewerVisible(true)} accessibilityRole="button" accessibilityLabel="Open full-screen image"><Image source={{ uri: image.download_url }} style={[styles.image, { backgroundColor: colors.muted }]} resizeMode="cover" /></Pressable>
      <View style={styles.details}><View style={styles.authorRow}><View style={styles.authorWrap}><Text style={[styles.eyebrow, { color: colors.accent }]}>CAPTURED BY</Text><Text numberOfLines={2} style={[styles.author, { color: colors.foreground }]}>{image.author}</Text></View><View style={[styles.idBadge, { backgroundColor: colors.secondary }]}><Text style={[styles.idText, { color: colors.secondaryForeground }]}>ID {image.id}</Text></View></View><Text style={[styles.caption, { color: colors.mutedForeground }]}>A frame worth keeping. Save it to your collection or download it for your gallery.</Text><CustomButton label={downloading ? 'Saving image…' : 'Download to gallery'} onPress={() => void downloadImage()} icon="download" disabled={downloading} /></View>
      <Modal visible={viewerVisible} animationType="fade" supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setViewerVisible(false)}>
        <View style={[styles.viewer, { backgroundColor: colors.background }]}><Pressable accessibilityRole="button" accessibilityLabel="Close full-screen image" onPress={() => setViewerVisible(false)} style={[styles.closeViewer, { backgroundColor: colors.card, top: Math.max(insets.top + 10, Platform.OS === 'web' ? 67 : 0) }]}><Feather name="x" size={22} color={colors.foreground} /></Pressable><Image source={{ uri: image.download_url }} style={styles.viewerImage} resizeMode="contain" /><Text style={[styles.viewerHint, { color: colors.mutedForeground }]}>Tap X to close</Text></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 15 }, topTitle: { fontSize: 16, fontWeight: '700' }, iconButton: { width: 41, height: 41, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, image: { width: '100%', aspectRatio: 0.93 }, details: { padding: 22, gap: 17 }, authorRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, authorWrap: { flex: 1, marginRight: 12 }, eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: '800', marginBottom: 5 }, author: { fontSize: 28, fontWeight: '700' }, idBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 }, idText: { fontSize: 12, fontWeight: '700' }, caption: { fontSize: 14, lineHeight: 21 }, viewer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }, viewerImage: { width: '100%', height: '82%' }, closeViewer: { position: 'absolute', right: 18, zIndex: 2, width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, viewerHint: { fontSize: 12, marginTop: 12 } });