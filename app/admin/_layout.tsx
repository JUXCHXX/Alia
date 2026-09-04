import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Stack } from "expo-router/stack";
import { getMiPerfil } from "../../src/services/profiles";
import { colors } from "../../src/constants/colors";

export default function AdminLayout() {
  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  useEffect(() => {
    getMiPerfil().then((perfil) => {
      if (perfil?.es_admin) {
        setAutorizado(true);
      } else {
        setAutorizado(false);
        router.replace("/(tabs)");
      }
    });
  }, []);

  if (autorizado === null) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  if (!autorizado) {
    return (
      <View style={styles.centro}>
        <Text>Redirigiendo...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
});
