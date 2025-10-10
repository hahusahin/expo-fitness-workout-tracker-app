import React, { useEffect, useRef, useState } from "react";
import { View, Animated, LayoutChangeEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ExerciseSkeletonProps {
  count?: number;
}

const ExerciseSkeleton: React.FC<ExerciseSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <View className="px-2">
      {[...Array(count)].map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
};

const SkeletonItem: React.FC = () => {
  const anim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const shimmerWidth = Math.max(80, containerWidth * 0.6);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    anim.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(w);
  };

  // translateX from -shimmerWidth to containerWidth
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth, containerWidth + shimmerWidth],
  });

  return (
    <View
      onLayout={onLayout}
      className="bg-white rounded-2xl mb-4 mx-1 overflow-hidden flex-row"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        position: 'relative',
      }}
    >
      {/* Image Skeleton */}
      <View className="w-32 h-32 bg-gray-300" />
      
      {/* Content Skeleton */}
      <View className="flex-1 p-4 justify-center">
        {/* Difficulty skeleton */}
        <View className="h-3 bg-gray-300 rounded mb-2 w-20" />
        {/* Title skeleton */}
        <View className="h-5 bg-gray-300 rounded mb-2 w-3/4" />
        {/* Description skeleton lines */}
        <View className="h-4 bg-gray-300 rounded w-full" />
        <View className="h-4 bg-gray-300 rounded w-2/3 mt-1" />
      </View>

      {/* Shimmer overlay */}
      {containerWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: shimmerWidth,
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={["transparent", 'rgba(255,255,255,0.6)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default ExerciseSkeleton;