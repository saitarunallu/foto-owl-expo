import React, { useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { CustomButton, CustomInput, LogoMark } from '@/components/ui';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

export default function LoginScreen() {
  const colors = useColors();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    Keyboard.dismiss();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    const success = await login(email, password);
    if (!success) {
      setError('Those credentials do not match a registered account.');
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAwareScrollViewCompat contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} bottomOffset={20}>
      <View style={styles.brand}>
        <LogoMark size={62} />
        <Text style={[styles.kicker, { color: colors.accent }]}>FOTO OWL</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>See the world{'\n'}from every angle.</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>A quiet place to collect images that make you pause.</Text>
      </View>
      <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.formTitle, { color: colors.foreground }]}>Welcome back</Text>
        <CustomInput label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <CustomInput label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry />
        {error ? <Text style={[styles.formError, { color: colors.destructive }]}>{error}</Text> : null}
        <CustomButton label="Log in" onPress={() => void handleLogin()} icon="arrow-right" />
        <View style={styles.registerRow}>
          <Text style={{ color: colors.mutedForeground }}>New to Foto Owl?</Text>
          <Link href="/(auth)/register" asChild><Pressable><Text style={{ color: colors.primary, fontWeight: '700' }}> Create an account</Text></Pressable></Link>
        </View>
      </View>
      <Text style={[styles.note, { color: colors.mutedForeground }]}>Your account and favorites stay on this device.</Text>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 64, paddingBottom: 28 },
  brand: { gap: 9, marginBottom: 34 },
  kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 2.5, marginTop: 9 },
  title: { fontSize: 34, lineHeight: 39, fontWeight: '700', letterSpacing: -1 },
  subtitle: { fontSize: 15, lineHeight: 22, maxWidth: 300 },
  form: { borderWidth: 1, borderRadius: 24, padding: 19, gap: 16 },
  formTitle: { fontSize: 21, fontWeight: '700', marginBottom: 2 },
  formError: { fontSize: 13, lineHeight: 18 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 2, fontSize: 13 },
  note: { textAlign: 'center', fontSize: 12, marginTop: 20 },
});