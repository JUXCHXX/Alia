import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUsuarios, UsuarioAdmin } from "../../src/services/admin";
import { colors } from "../../src/constants/colors";

export default function UsuariosAdminScreen() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getUsuarios().then(setUsuarios).finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListHeaderComponent={<Text style={styles.titulo}>Usuarios ({usuarios.length})</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.dato}>{item.telefono ?? "Sin teléfono"} · {item.ciudad ?? "Sin ciudad"}</Text>
            {item.suspendido && <Text style={styles.suspendido}>SUSPENDIDO</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 20, fontWeight: "600", color: colors.quartzite, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  nombre: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  dato: { color: colors.coolClay, marginTop: 4 },
  suspendido: { color: colors.sugoDellaNonna, fontWeight: "600", marginTop: 8, fontSize: 12 },
});