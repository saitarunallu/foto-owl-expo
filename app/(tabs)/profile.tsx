import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { CustomButton, CustomInput, LogoMark, RadioOption, SelectField } from '@/components/ui';
import { Gender, User } from '@/types';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

const genders: Gender[] = ['Male', 'Female', 'Other'];
const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Other'];

export default function ProfileScreen() {
  const colors = useColors();
  const { user, updateProfile, logout, theme, setTheme } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<User | null>(user);
  useEffect(() => setForm(user), [user]);
  if (!user || !form) return null;
  const setField = (field: keyof User, value: string) => setForm((current) => current ? { ...current, [field]: value } : current);
  async function save() {
    const currentForm = form;
    if (!currentForm || !currentForm.fullName.trim() || !currentForm.email.trim() || !currentForm.mobile.trim() || !currentForm.address.trim() || !currentForm.city) {
      Alert.alert('Incomplete profile', 'Please complete all profile fields.');
      return;
    }
    await updateProfile(currentForm);
    setEditing(false);
    Alert.alert('Profile updated', 'Your changes are saved on this device.');
  }
  async function handleLogout() { await logout(); router.replace('/(auth)/login'); }
  return (
    <KeyboardAwareScrollViewCompat contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} bottomOffset={20}>
      <View style={styles.header}><View style={styles.identity}><LogoMark size={52} /><View><Text style={[styles.eyebrow, { color: colors.accent }]}>YOUR ACCOUNT</Text><Text style={[styles.title, { color: colors.foreground }]}>Profile</Text></View></View><Pressable onPress={() => setEditing((current) => !current)} style={[styles.editIcon, { backgroundColor: colors.secondary }]}><Feather name={editing ? 'x' : 'edit-2'} size={18} color={colors.primary} /></Pressable></View>
      {!editing ? <View style={styles.profileContent}>
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}><Text style={styles.heroName}>{user.fullName}</Text><Text style={styles.heroEmail}>{user.email}</Text><View style={styles.heroBadge}><Feather name="shield" size={13} color={colors.primaryForeground} /><Text style={styles.heroBadgeText}>Stored locally</Text></View></View>
        <InfoRow icon="phone" label="Mobile number" value={user.mobile} /><InfoRow icon="map-pin" label="Location" value={`${user.city} · ${user.address}`} /><InfoRow icon="user" label="Gender" value={user.gender} />
      </View> : <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <CustomInput label="Full name" value={form.fullName} onChangeText={(value) => setField('fullName', value)} />
        <CustomInput label="Email address" value={form.email} onChangeText={(value) => setField('email', value)} keyboardType="email-address" />
        <CustomInput label="Mobile number" value={form.mobile} onChangeText={(value) => setField('mobile', value.replace(/\D/g, '').slice(0, 10))} keyboardType="phone-pad" />
        <CustomInput label="Address" value={form.address} onChangeText={(value) => setField('address', value)} multiline />
        <SelectField label="City" value={form.city} placeholder="Select your city" options={cities} onChange={(city) => setField('city', city)} />
        <View style={styles.field}><Text style={[styles.label, { color: colors.secondaryForeground }]}>Gender</Text><View style={styles.choiceRow}>{genders.map((gender) => <RadioOption key={gender} label={gender} selected={form.gender === gender} onPress={() => setField('gender', gender)} />)}</View></View>
        <CustomButton label="Save changes" onPress={() => void save()} icon="check" />
      </View>}
      <View style={[styles.preference, { backgroundColor: colors.card, borderColor: colors.border }]}><View><Text style={[styles.preferenceTitle, { color: colors.foreground }]}>Dark mode</Text><Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Use a deeper, softer palette at night.</Text></View><Switch value={theme === 'dark'} onValueChange={(value) => void setTheme(value ? 'dark' : 'light')} trackColor={{ false: colors.secondary, true: colors.accent }} thumbColor={colors.card} /></View>
      <CustomButton label="Log out" onPress={() => void handleLogout()} variant="danger" icon="log-out" />
    </KeyboardAwareScrollViewCompat>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  const colors = useColors();
  return <View style={[styles.infoRow, { borderBottomColor: colors.border }]}><View style={[styles.infoIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={16} color={colors.primary} /></View><View style={{ flex: 1, gap: 3 }}><Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text></View></View>;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 19, paddingTop: 57, paddingBottom: 100, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 13 }, eyebrow: { fontSize: 11, letterSpacing: 1.7, fontWeight: '800', marginBottom: 5 }, title: { fontSize: 30, fontWeight: '700' }, editIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileContent: { gap: 4 }, heroCard: { borderRadius: 22, padding: 20, gap: 5, marginBottom: 9 }, heroName: { color: '#FFFDF8', fontSize: 23, fontWeight: '700' }, heroEmail: { color: '#D9E6E5', fontSize: 14 }, heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }, heroBadgeText: { color: '#FFFDF8', fontSize: 12, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, borderBottomWidth: 1 }, infoIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, infoLabel: { fontSize: 12 }, infoValue: { fontSize: 15, fontWeight: '600' },
  form: { borderRadius: 22, borderWidth: 1, padding: 17, gap: 16 }, field: { gap: 8 }, label: { fontSize: 13, fontWeight: '700' }, choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  preference: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 17, padding: 15 }, preferenceTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
});