import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Colors from '@/constants/colors';

interface DonutChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  size?: number;
  strokeWidth?: number;
  showCenter?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DonutChart({ 
  data, 
  size = 200, 
  strokeWidth = 30,
  showCenter = true
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const animations = useRef(
    data.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animationSequence = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );

    Animated.stagger(100, animationSequence).start();
  }, []);

  let currentAngle = 0;

  return (
    <View style={styles.container}>
      <View style={[styles.chart, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.light.gray200}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {data.map((item, index) => {
              const percentage = item.value / total;
              const strokeDashoffset = circumference * (1 - percentage);
              const rotation = currentAngle;
              currentAngle += percentage * 360;

              return (
                <AnimatedCircle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [circumference, strokeDashoffset],
                  })}
                  rotation={rotation}
                  origin={`${size / 2}, ${size / 2}`}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
          
          {showCenter && (
            <G>
              <SvgText
                x={size / 2}
                y={size / 2 - 8}
                fontSize="24"
                fontWeight="bold"
                fill={Colors.light.text}
                textAnchor="middle"
              >
                {total}
              </SvgText>
              <SvgText
                x={size / 2}
                y={size / 2 + 16}
                fontSize="12"
                fill={Colors.light.gray600}
                textAnchor="middle"
              >
                Total
              </SvgText>
            </G>
          )}
        </Svg>
        
        <View style={styles.shadowLayer} />
      </View>
      
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendIconContainer}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <View style={[styles.legendGlow, { backgroundColor: item.color, opacity: 0.2 }]} />
            </View>
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendValue}>
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  chart: {
    marginBottom: 24,
    position: 'relative',
  },
  shadowLayer: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 1000,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  legend: {
    gap: 12,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  legendIconContainer: {
    position: 'relative',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  legendGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.gray700,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
});
