import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { CustomButton, CustomInput, LogoMark, RadioOption, SelectField } from '@/components/ui';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Gender, User } from '@/types';

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Other'];
const genders: Gender[] = ['Male', 'Female', 'Other'];
type RegistrationForm = Omit<User, 'gender'> & { gender: Gender | ''; confirmPassword: string };

export default function RegisterScreen() {
  const colors = useColors();
  const { registerUser } = useApp();
  const [form, setForm] = useState<RegistrationForm>({ fullName: '', email: '', gender: '', mobile: '', address: '', city: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const setField = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  function validate() {
    if (Object.values(form).some((value) => !value.trim())) return 'Please complete every field.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (!/^\d{10}$/.test(form.mobile)) return 'Mobile number must contain exactly 10 digits.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return '';
  }

  async function handleRegister() {
    Keyboard.dismiss();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const { confirmPassword: _confirmPassword, ...newUser } = form;
    await registerUser(newUser as User);
    router.replace('/(auth)/login');
  }

  return (
    <KeyboardAwareScrollViewCompat contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} bottomOffset={20}>
      <View style={styles.heading}>
        <LogoMark size={48} />
        <View style={{ flex: 1, gap: 3 }}><Text style={[styles.title, { color: colors.foreground }]}>Create your account</Text><Text style={{ color: colors.mutedForeground }}>Start building your visual collection.</Text></View>
      </View>
      <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <CustomInput label="Full name" value={form.fullName} onChangeText={(value) => setField('fullName', value)} placeholder="Aarav Sharma" />
        <CustomInput label="Email address" value={form.email} onChangeText={(value) => setField('email', value)} placeholder="you@example.com" keyboardType="email-address" />
        <View style={styles.field}><Text style={[styles.label, { color: colors.secondaryForeground }]}>Gender</Text><View style={styles.choiceRow}>{genders.map((gender) => <RadioOption key={gender} label={gender} selected={form.gender === gender} onPress={() => setField('gender', gender)} />)}</View></View>
        <CustomInput label="Mobile number" value={form.mobile} onChangeText={(value) => setField('mobile', value.replace(/\D/g, '').slice(0, 10))} placeholder="10 digit mobile number" keyboardType="phone-pad" />
        <CustomInput label="Address" value={form.address} onChangeText={(value) => setField('address', value)} placeholder="Your street address" multiline />
        <SelectField label="City" value={form.city} placeholder="Select your city" options={cities} onChange={(city) => setField('city', city)} />
        <CustomInput label="Password" value={form.password} onChangeText={(value) => setField('password', value)} placeholder="At least 6 characters" secureTextEntry />
        <CustomInput label="Confirm password" value={form.confirmPassword} onChangeText={(value) => setField('confirmPassword', value)} placeholder="Re-enter password" secureTextEntry />
        {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
        <CustomButton label="Create account" onPress={() => void handleRegister()} icon="user-plus" />
        <CustomButton label="Back to login" onPress={() => router.back()} variant="ghost" />
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 54, paddingBottom: 30 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 25 },
  title: { fontSize: 26, fontWeight: '700' },
  form: { borderWidth: 1, borderRadius: 24, padding: 18, gap: 16 },
  field: { gap: 9 },
  label: { fontSize: 13, fontWeight: '700' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  error: { fontSize: 13, lineHeight: 18 },
});