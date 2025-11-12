import { useEffect } from 'react';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { isAuthenticated } = useApp();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0EA5E9" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
});
