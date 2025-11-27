import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// icons are provided via the local Icons shim
import Colors from '@/constants/colors';

interface KPICardProps {
  title: string;
  value: string | number;
  // accept a component that renders an icon (size/color props)
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBackground: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBackground,
  subtitle,
  onPress,
}: KPICardProps) {
  const content = (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
        <Icon size={24} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: Colors.light.gray500,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.light.gray400,
    marginTop: 2,
  },
});
