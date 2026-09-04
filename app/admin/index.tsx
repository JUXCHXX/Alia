import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEstadisticasGenerales, EstadisticasGenerales } from "../../src/services/admin";
import { colors } from "../../src/constants/colors";

export default function AdminDashboard() {
  const [stats, setStats] = useState<EstadisticasGenerales | null>(null);

  useEffect(() => {
    getEstadisticasGenerales().then(setStats);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.titulo}>Panel de administración</Text>

      {stats ? (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{stats.totalClientes}</Text>
            <Text style={styles.statLabel}>Clientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{stats.totalProfesionales}</Text>
            <Text style={styles.statLabel}>Profesionales</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{stats.totalServiciosActivos}</Text>
            <Text style={styles.statLabel}>Servicios activos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{stats.solicitudesPendientes}</Text>
            <Text style={styles.statLabel}>Solicitudes pendientes</Text>
          </View>
        </View>
      ) : (
        <ActivityIndicator color={colors.lionfishRed} style={{ marginTop: 20 }} />
      )}

      <Pressable style={styles.opcion} onPress={() => router.push("/admin/usuarios")}>
        <Text style={styles.opcionTexto}>Usuarios (clientes)</Text>
      </Pressable>

      <Pressable style={styles.opcion} onPress={() => router.push("/admin/profesionales")}>
        <Text style={styles.opcionTexto}>Profesionales pendientes</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "600", color: colors.quartzite, marginBottom: 20 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: {
    flexBasis: "47%",
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
  },
  statNumero: { fontSize: 24, fontWeight: "600", color: colors.quartzite },
  statLabel: { color: colors.coolClay, fontSize: 12, marginTop: 4, textTransform: "uppercase" },
  opcion: {
    borderWidth: 1,
    borderColor: colors.nettleGreen,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  opcionTexto: { color: colors.nettleGreen, fontWeight: "600" },
});
