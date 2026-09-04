import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { getMisGanancias, MovimientoFinanciero } from "../../src/services/bookings";
import { colors } from "../../src/constants/colors";

export default function GananciasScreen() {
  const [movimientos, setMovimientos] = useState<MovimientoFinanciero[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMisGanancias()
        .then(setMovimientos)
        .finally(() => setCargando(false));
    }, [])
  );

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  const totalPagado = movimientos
    .filter((m) => m.profesional_pagado)
    .reduce((suma, m) => suma + m.monto_profesional, 0);
  const totalPendiente = movimientos
    .filter((m) => !m.profesional_pagado)
    .reduce((suma, m) => suma + m.monto_profesional, 0);

  return (
    <View style={styles.container}>
      <View style={styles.resumen}>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenLabel}>Ya pagado</Text>
          <Text style={styles.resumenMontoPagado}>${totalPagado.toLocaleString("es-CO")}</Text>
        </View>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenLabel}>Pendiente</Text>
          <Text style={styles.resumenMontoPendiente}>${totalPendiente.toLocaleString("es-CO")}</Text>
        </View>
      </View>

      <FlatList
        data={movimientos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no tienes pagos aprobados.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cliente}>
              {item.bookings?.profiles?.nombre ?? "Cliente"}
            </Text>
            <Text style={styles.servicio}>
              {item.bookings?.services?.nombre ?? "Servicio"}
            </Text>
            <Text style={styles.monto}>
              ${item.monto_profesional.toLocaleString("es-CO")}
            </Text>
            <Text
              style={[
                styles.estadoPago,
                { color: item.profesional_pagado ? colors.nettleGreen : colors.sugoDellaNonna },
              ]}
            >
              {item.profesional_pagado ? "Pagado" : "Pendiente de pago"}
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
    flexDirection: "row",
    padding: 24,
    paddingTop: 60,
    gap: 12,
  },
  resumenItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
  },
  resumenLabel: { color: colors.coolClay, fontSize: 12, textTransform: "uppercase" },
  resumenMontoPagado: { color: colors.nettleGreen, fontSize: 18, fontWeight: "600", marginTop: 4 },
  resumenMontoPendiente: { color: colors.sugoDellaNonna, fontSize: 18, fontWeight: "600", marginTop: 4 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cliente: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  servicio: { color: colors.nettleGreen, marginTop: 4 },
  monto: { color: colors.quartzite, fontWeight: "600", marginTop: 4, fontSize: 16 },
  estadoPago: { fontSize: 12, marginTop: 8, textTransform: "uppercase", fontWeight: "600" },
});
