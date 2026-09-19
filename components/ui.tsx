import React from 'react';
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { FotoImage } from '@/types';
import { useApp } from '@/context/AppContext';

export function LogoMark({ size = 44 }: { size?: number }) {
  const colors = useColors();
  return (
    <View style={[styles.logo, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: colors.primary }]}>
      <Feather name="camera" size={size * 0.44} color={colors.primaryForeground} />
      <View style={[styles.logoDot, { backgroundColor: colors.accent }]} />
    </View>
  );
}

export function CustomButton({ label, onPress, variant = 'primary', icon, disabled = false }: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
}) {
  const colors = useColors();
  const backgroundColor = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.destructive : variant === 'secondary' ? colors.secondary : 'transparent';
  const textColor = variant === 'primary' || variant === 'danger' ? colors.primaryForeground : variant === 'secondary' ? colors.secondaryForeground : colors.primary;
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, { backgroundColor, borderColor: colors.border, opacity: disabled ? 0.45 : pressed ? 0.72 : 1 }, variant === 'ghost' && styles.ghostButton]}
    >
      {icon ? <Feather name={icon} size={17} color={textColor} /> : null}
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function CustomInput({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', multiline = false, error }: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  error?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.inputWrap}>
      <Text style={[styles.inputLabel, { color: colors.secondaryForeground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' || secureTextEntry ? 'none' : 'sentences'}
        autoCorrect={keyboardType === 'email-address' || secureTextEntry ? false : true}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, { color: colors.foreground, borderColor: error ? colors.destructive : colors.input, backgroundColor: colors.card }, multiline && styles.multilineInput]}
      />
      {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}
    </View>
  );
}

export function ChoicePill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.pill, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : colors.card }]}>
      <Text style={{ color: selected ? colors.primaryForeground : colors.secondaryForeground, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export function RadioOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }} style={styles.radioOption}>
      <View style={[styles.radioCircle, { borderColor: selected ? colors.primary : colors.input }]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
      </View>
      <Text style={{ color: colors.secondaryForeground, fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

export function SelectField({ label, value, placeholder, options, onChange }: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const colors = useColors();
  const [visible, setVisible] = React.useState(false);
  return (
    <View style={styles.inputWrap}>
      <Text style={[styles.inputLabel, { color: colors.secondaryForeground }]}>{label}</Text>
      <Pressable onPress={() => setVisible(true)} accessibilityRole="button" accessibilityLabel={value || placeholder} style={[styles.selectField, { borderColor: colors.input, backgroundColor: colors.card }]}>
        <Text style={{ color: value ? colors.foreground : colors.mutedForeground, fontSize: 15 }}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={18} color={colors.mutedForeground} />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setVisible(false)}>
          <Pressable style={[styles.selectMenu, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={(event) => event.stopPropagation()}>
            <Text style={[styles.selectTitle, { color: colors.foreground }]}>{label}</Text>
            {options.map((option) => (
              <Pressable key={option} onPress={() => { onChange(option); setVisible(false); }} style={[styles.selectOption, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.foreground, fontSize: 15 }}>{option}</Text>
                {value === option ? <Feather name="check" size={18} color={colors.accent} /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function LoadingIndicator({ label = 'Loading photos…' }: { label?: string }) {
  const colors = useColors();
  return <View style={styles.centerState}><ActivityIndicator color={colors.accent} size="large" /><Text style={[styles.stateText, { color: colors.mutedForeground }]}>{label}</Text></View>;
}

export function EmptyState({ icon = 'image', title, description, action }: { icon?: keyof typeof Feather.glyphMap; title: string; description?: string; action?: { label: string; onPress: () => void } }) {
  const colors = useColors();
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={24} color={colors.primary} /></View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      {description ? <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>{description}</Text> : null}
      {action ? <CustomButton label={action.label} onPress={action.onPress} variant="secondary" icon="rotate-cw" /> : null}
    </View>
  );
}

export function ImageCard({ image, onPress }: { image: FotoImage; onPress: () => void }) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite(image.id);
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Open image by ${image.author}`} style={({ pressed }) => [styles.imageCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.82 : 1 }]}>
      <View>
        <Image source={{ uri: image.download_url }} style={[styles.thumbnail, { backgroundColor: colors.muted }]} />
        <Pressable
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={favorite ? `Remove ${image.author} from favorites` : `Add ${image.author} to favorites`}
          onPress={(event) => {
            event.stopPropagation();
            void toggleFavorite(image);
          }}
          style={[styles.heartButton, { backgroundColor: colors.card }]}
        >
          <Feather name="heart" size={16} color={favorite ? colors.destructive : colors.mutedForeground} fill={favorite ? colors.destructive : 'none'} />
        </Pressable>
      </View>
      <View style={styles.cardMeta}>
        <Text numberOfLines={1} style={[styles.author, { color: colors.foreground }]}>{image.author}</Text>
        <Text style={[styles.idText, { color: colors.mutedForeground }]}>ID {image.id}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logo: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  logoDot: { width: 6, height: 6, borderRadius: 3, position: 'absolute', right: 9, top: 9 },
  button: { minHeight: 50, borderRadius: 16, borderWidth: 1, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ghostButton: { borderWidth: 0 },
  buttonText: { fontSize: 15, fontWeight: '700' },
  inputWrap: { gap: 7 },
  inputLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  input: { borderWidth: 1, borderRadius: 14, minHeight: 50, paddingHorizontal: 15, fontSize: 15 },
  multilineInput: { minHeight: 88, paddingTop: 14 },
  errorText: { fontSize: 12, marginLeft: 3 },
  pill: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 9 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, paddingRight: 10 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  selectField: { minHeight: 50, borderWidth: 1, borderRadius: 14, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'center', padding: 24 },
  selectMenu: { borderWidth: 1, borderRadius: 20, padding: 16 },
  selectTitle: { fontSize: 18, fontWeight: '700', marginBottom: 7 },
  selectOption: { minHeight: 49, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  centerState: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  stateText: { fontSize: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 36, gap: 12 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  emptyDescription: { textAlign: 'center', fontSize: 14, lineHeight: 20, maxWidth: 280 },
  imageCard: { flex: 1, borderWidth: 1, borderRadius: 18, overflow: 'hidden', margin: 5, minWidth: 0 },
  thumbnail: { width: '100%', aspectRatio: 1.05 },
  heartButton: { width: 31, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 9, right: 9 },
  cardMeta: { padding: 11, gap: 3 },
  author: { fontSize: 14, fontWeight: '700' },
  idText: { fontSize: 11, fontWeight: '500' },
});