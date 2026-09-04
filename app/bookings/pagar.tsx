import { View, Pressable, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../src/constants/colors";

export default function PagarScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Pressable style={styles.cerrar} onPress={() => router.back()}>
        <Text style={styles.cerrarTexto}>✕ Cerrar</Text>
      </Pressable>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cerrar: { padding: 12, alignItems: "flex-end" },
  cerrarTexto: { color: colors.sugoDellaNonna, fontWeight: "600" },
});
