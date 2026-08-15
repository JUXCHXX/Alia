import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getMiDisponibilidad } from "../../src/services/availability";
import { AvailabilityBlock, DIAS_SEMANA } from "../../src/types/availability";
import { colors } from "../../src/constants/colors";

export default function DisponibilidadScreen() {
  const [bloques, setBloques] = useState<AvailabilityBlock[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMiDisponibilidad()
        .then(setBloques)
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
        data={bloques}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no has definido tu horario.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.dia}>{DIAS_SEMANA[item.dia_semana]}</Text>
            <Text style={styles.hora}>
              {item.hora_inicio.slice(0, 5)} - {item.hora_fin.slice(0, 5)}
            </Text>
            <Text style={styles.estado}>
              {item.activo ? "Activo" : "Inactivo"}
            </Text>
          </View>
        )}
      />

      <Pressable
        style={styles.botonFlotante}
        onPress={() => router.push("/disponibilidad/agregar")}
      >
        <Text style={styles.botonFlotanteTexto}>+ Agregar horario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 60 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 16,
  },
  dia: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  hora: { color: colors.nettleGreen, marginTop: 4 },
  estado: { color: colors.coolClay, fontSize: 12, marginTop: 4, textTransform: "uppercase" },
  botonFlotante: {
    backgroundColor: colors.lionfishRed,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  botonFlotanteTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});