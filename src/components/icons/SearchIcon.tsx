import { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

type IconProps = { size?: number; color: string; focused?: boolean };

export function SearchIcon({ size = 24, color, focused = false }: IconProps) {
  const shake = useSharedValue(0);

  useEffect(() => {
    if (focused) shake.value = withSequence(
      withTiming(1, { duration: 70, easing: Easing.out(Easing.ease) }),
      withTiming(-1, { duration: 100 }),
      withTiming(0.6, { duration: 80 }),
      withTiming(0, { duration: 100 }),
    );
  }, [focused, shake]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: shake.value * 1.5 },
      { translateY: shake.value * 0.5 },
      { rotate: `${shake.value * 3}deg` },
    ],
  }));

  return (
    <Animated.View style={style as ViewStyle}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="m21 21-4.34-4.34" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Animated.View>
  );
}
