import { useEffect } from "react";
import Animated, { useAnimatedProps, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
type IconProps = { size?: number; color: string; focused?: boolean };

export function MessageHeartIcon({ size = 24, color, focused = false }: IconProps) {
  const bubble = useSharedValue(1);
  const heart = useSharedValue(1);

  useEffect(() => {
    if (!focused) return;
    bubble.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 220 }));
    heart.value = withDelay(120, withSequence(
      withTiming(0.6, { duration: 0 }),
      withTiming(1.22, { duration: 120 }),
      withTiming(1, { duration: 90 }),
      withTiming(1.14, { duration: 80 }),
      withTiming(1, { duration: 90 }),
    ));
  }, [focused, bubble, heart]);

  const bubbleProps = useAnimatedProps(() => ({
    opacity: bubble.value,
    transform: `translate(12 12) scale(${bubble.value}) translate(-12 -12)`,
  }));
  const heartProps = useAnimatedProps(() => ({
    transform: `translate(12 12) scale(${heart.value}) translate(-12 -12)`,
  }));

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath animatedProps={bubbleProps} d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <AnimatedPath animatedProps={heartProps} d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
