import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { UserCircle2, Lock, LogIn } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('director');

  const roles = [
    { value: 'director', label: 'Director' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'principal', label: 'Principal' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'clerk', label: 'Clerk' },
    { value: 'auditor', label: 'Auditor' },
  ];

  const handleLogin = () => {
    const success = login(username, password, selectedRole);
    if (success) {
      router.replace('/dashboard');
    }
  };

  return (
    <LinearGradient
      colors={['#0EA5E9', '#38BDF8', '#7DD3FC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <UserCircle2 size={48} color="#0EA5E9" />
            </View>
          </View>
          <Text style={styles.title}>Director App</Text>
          <Text style={styles.subtitle}>R.L. Academy School Management</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <UserCircle2 size={20} color={Colors.light.gray400} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={Colors.light.gray400}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.light.gray400} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.light.gray400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Select Role</Text>
            <View style={styles.roleGrid}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleButton,
                    selectedRole === role.value && styles.roleButtonActive,
                  ]}
                  onPress={() => setSelectedRole(role.value)}
                >
                  <Text
                    style={[
                      styles.roleText,
                      selectedRole === role.value && styles.roleTextActive,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LogIn size={20} color="#fff" />
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -100,
    left: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: 100,
    right: -50,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 50,
    left: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.95,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 24,
    padding: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.light.text,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
    marginBottom: 12,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.light.gray100,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
  },
  roleButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.gray600,
  },
  roleTextActive: {
    color: '#fff',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
