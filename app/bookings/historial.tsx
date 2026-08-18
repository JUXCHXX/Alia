import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getMiHistorial, HistorialItem } from "../../src/services/bookings";
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

export default function HistorialClienteScreen() {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMiHistorial()
        .then(setHistorial)
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

  return (
    <View style={styles.container}>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no tienes historial.</Text>
        }
        renderItem={({ item }) => {
          const yaCalificado = item.reviews && item.reviews.length > 0;
          return (
            <View style={styles.card}>
              <Text style={styles.profesional}>
                {item.profiles?.nombre ?? "Profesional"}
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

              {item.estado === "completada" && (
                yaCalificado ? (
                  <Text style={styles.calificado}>
                    {"★".repeat(item.reviews![0].calificacion)} Calificado
                  </Text>
                ) : (
                  <Pressable
                    style={styles.botonCalificar}
                    onPress={() =>
                      router.push({
                        pathname: "/bookings/calificar",
                        params: {
                          bookingId: item.id,
                          nombreProfesional: item.profiles?.nombre ?? "",
                        },
                      })
                    }
                  >
                    <Text style={styles.botonCalificarTexto}>Calificar servicio</Text>
                  </Pressable>
                )
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 40 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  profesional: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  servicio: { color: colors.nettleGreen, marginTop: 4 },
  precio: { color: colors.quartzite, marginTop: 4, fontWeight: "600" },
  estado: { fontSize: 12, marginTop: 8, textTransform: "uppercase", fontWeight: "600" },
  calificado: { color: colors.lionfishRed, marginTop: 10, fontWeight: "600" },
  botonCalificar: {
    backgroundColor: colors.lionfishRed,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  botonCalificarTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});