import { ImageBackground, StyleSheet, ImageSourcePropType } from "react-native";

interface FondoProps {
  source: ImageSourcePropType;
  children: React.ReactNode;
}

export function Fondo({ source, children }: FondoProps) {
  return (
    <ImageBackground source={source} style={styles.fondo} resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1 },
});