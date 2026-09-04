import { useEffect } from "react";
import Animated, { useAnimatedProps, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
type IconProps = { size?: number; color: string; focused?: boolean };

export function UserIcon({ size = 24, color, focused = false }: IconProps) {
  const head = useSharedValue(1);
  const body = useSharedValue(1);

  useEffect(() => {
    if (!focused) return;
    head.value = withSequence(withTiming(0.5, { duration: 0 }), withTiming(1.2, { duration: 130 }), withTiming(1, { duration: 120 }));
    body.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 200 }));
  }, [focused, head, body]);

  const headProps = useAnimatedProps(() => ({ transform: `translate(12 8) scale(${head.value}) translate(-12 -8)` }));
  const bodyProps = useAnimatedProps(() => ({ opacity: body.value }));

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedCircle animatedProps={headProps} cx="12" cy="8" r="5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <AnimatedPath animatedProps={bodyProps} d="M20 21a8 8 0 0 0-16 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
