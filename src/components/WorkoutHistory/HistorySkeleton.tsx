import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

interface HistorySkeletonProps {
  count?: number;
}

const SkeletonBox: React.FC<{ style?: any }> = ({ style }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 1], [0.3, 0.7]);
    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#d1d5db',
          borderRadius: 6,
        },
        style,
        animatedStyle,
      ]}
    />
  );
};

const HistorySkeleton: React.FC<HistorySkeletonProps> = ({
  count = 3,
}) => {
  return (
    <View className="px-4">
      {[...Array(count)].map((_, index) => (
        <View
          key={index}
          className="bg-white rounded-2xl mb-4 p-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          {/* Header skeleton */}
          <View className="flex-row justify-between items-start mb-3 pr-6">
            <SkeletonBox style={{ height: 20, width: '60%' }} />
            <SkeletonBox style={{ height: 16, width: 80 }} />
          </View>

          {/* Stats badges skeleton */}
          <View className="flex-row mb-3 gap-2">
            <SkeletonBox style={{ height: 24, width: 80, borderRadius: 12 }} />
            <SkeletonBox style={{ height: 24, width: 64, borderRadius: 12 }} />
            <SkeletonBox style={{ height: 24, width: 48, borderRadius: 12 }} />
          </View>

          {/* Exercise list skeleton */}
          <View className="mb-2">
            <SkeletonBox style={{ height: 16, width: '75%', marginBottom: 4 }} />
            <SkeletonBox style={{ height: 16, width: '65%', marginBottom: 4 }} />
            <SkeletonBox style={{ height: 16, width: '50%' }} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default HistorySkeleton;