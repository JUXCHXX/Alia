import { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type IconProps = { size?: number; color: string; focused?: boolean };

export function HouseIcon({ size = 24, color, focused = false }: IconProps) {
  const scale = useSharedValue(1);
  const door = useSharedValue(0);

  useEffect(() => {
    if (!focused) return;
    scale.value = withSequence(
      withTiming(0.7, { duration: 90 }),
      withTiming(1.06, { duration: 130 }),
      withTiming(0.98, { duration: 90 }),
      withTiming(1, { duration: 100 }),
    );
    door.value = withDelay(
      170,
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 180, easing: Easing.out(Easing.ease) }),
      ),
    );
  }, [focused, door, scale]);

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const doorProps = useAnimatedProps(() => ({
    opacity: door.value,
    transform: `translate(12 17) scale(1 ${door.value}) translate(-12 -17)`,
  }));

  return (
    <Animated.View style={containerStyle as ViewStyle}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <AnimatedPath animatedProps={doorProps} d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Animated.View>
  );
}
