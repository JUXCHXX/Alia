import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { getMisServicios } from "../../src/services/services";
import { Service } from "../../src/types/service";
import { colors } from "../../src/constants/colors";

export default function MisServiciosScreen() {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMisServicios()
        .then(setServicios)
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
        data={servicios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no has publicado servicios.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.precio}>
              ${item.precio.toLocaleString("es-CO")}
            </Text>
            <Text style={styles.estado}>
              {item.activo ? "Activo" : "Inactivo"}
            </Text>
          </View>
        )}
      />

      <Pressable
        style={styles.botonFlotante}
        onPress={() => router.push("/servicios/crear")}
      >
        <Text style={styles.botonFlotanteTexto}>+ Nuevo servicio</Text>
      </Pressable>
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
  nombre: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  precio: { color: colors.nettleGreen, marginTop: 4 },
  estado: { color: colors.coolClay, fontSize: 12, marginTop: 4, textTransform: "uppercase" },
  botonFlotante: {
    backgroundColor: colors.lionfishRed,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  botonFlotanteTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});