import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Colors from '@/constants/colors';

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  height?: number;
  show3D?: boolean;
}

export default function BarChart({ data, height = 220, show3D = true }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const animations = useRef(
    data.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animationSequence = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 80,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: false,
      })
    );

    Animated.stagger(80, animationSequence).start();
  }, [animations]);

  return (
    <View style={styles.container}>
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 50);
          
          const animatedHeight = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [4, barHeight],
          });

          const animatedOpacity = animations[index].interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.8, 1],
          });

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: animatedHeight,
                      backgroundColor: item.color,
                      opacity: animatedOpacity,
                    },
                  ]}
                >
                  {show3D && (
                    <>
                      <View style={[styles.barTop, { backgroundColor: item.color }]} />
                      <View style={[styles.barSide, { backgroundColor: item.color }]} />
                    </>
                  )}
                </Animated.View>
                <Animated.View
                  style={[
                    styles.valueLabel,
                    { opacity: animatedOpacity }
                  ]}
                >
                  <Text style={styles.valueText}>{item.value}</Text>
                </Animated.View>
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  bar: {
    width: '85%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  barTop: {
    position: 'absolute',
    top: -3,
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 6,
    opacity: 0.8,
  },
  barSide: {
    position: 'absolute',
    right: -3,
    top: 3,
    bottom: 0,
    width: 6,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    opacity: 0.5,
  },
  valueLabel: {
    position: 'absolute',
    top: -24,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  valueText: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  label: {
    fontSize: 11,
    color: Colors.light.gray600,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
});
