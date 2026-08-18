import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { getHistorialProfesional, HistorialProfesionalItem } from "../../src/services/bookings";
import { colors } from "../../src/constants/colors";

const ETIQUETA_ESTADO: Record<string, string> = {
  completada: "Completada",
  cancelada: "Cancelada",
  rechazada: "Rechazada",
};

const COLOR_ESTADO: Record<string, string> = {
  completada: colors.nettleGreen,
  cancelada: colors.sugoDellaNonna,
  rechazada: colors.sugoDellaNonna,
};

export default function HistorialProfesionalScreen() {
  const [historial, setHistorial] = useState<HistorialProfesionalItem[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getHistorialProfesional()
        .then(setHistorial)
        .finally(() => setCargando(false));
    }, [])
  );

  const totalCompletados = historial.filter((h) => h.estado === "completada");
  const totalGanado = totalCompletados.reduce(
    (suma, item) => suma + (item.services?.precio ?? 0),
    0
  );

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {totalCompletados.length > 0 && (
        <View style={styles.resumen}>
          <Text style={styles.resumenTexto}>
            {totalCompletados.length} servicio{totalCompletados.length !== 1 ? "s" : ""} completado{totalCompletados.length !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.resumenMonto}>
            ${totalGanado.toLocaleString("es-CO")}
          </Text>
        </View>
      )}

      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no tienes historial.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cliente}>
              {item.profiles?.nombre ?? "Cliente"}
            </Text>
            <Text style={styles.servicio}>
              {item.services?.nombre ?? "Servicio"}
            </Text>
            {item.services?.precio != null && (
              <Text style={styles.precio}>
                ${item.services.precio.toLocaleString("es-CO")}
              </Text>
            )}
            <Text style={[styles.estado, { color: COLOR_ESTADO[item.estado] }]}>
              {ETIQUETA_ESTADO[item.estado]}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 40 },
  resumen: {
    backgroundColor: colors.nettleGreen,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumenTexto: { color: "white", fontWeight: "600" },
  resumenMonto: { color: "white", fontWeight: "600", fontSize: 16 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cliente: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  servicio: { color: colors.nettleGreen, marginTop: 4 },
  precio: { color: colors.quartzite, marginTop: 4, fontWeight: "600" },
  estado: { fontSize: 12, marginTop: 8, textTransform: "uppercase", fontWeight: "600" },
});