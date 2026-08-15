import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getTodosLosServicios, ServicioConDetalle } from "../../src/services/services";
import { colors } from "../../src/constants/colors";

export default function TodosLosServiciosScreen() {
  const [servicios, setServicios] = useState<ServicioConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getTodosLosServicios()
      .then(setServicios)
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Todos los servicios</Text>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no hay servicios activos.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/profesionales/[id]",
                params: { id: item.professional_id },
              })
            }
          >
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.categoria}>
              {item.categories?.nombre ?? "Sin categoría"}
            </Text>
            <Text style={styles.profesional}>
              {item.profiles?.nombre ?? "Profesional"}
            </Text>
            <Text style={styles.precio}>
              ${item.precio.toLocaleString("es-CO")}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 22, fontWeight: "600", color: colors.quartzite, marginBottom: 16 },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 40 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  nombre: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  categoria: { color: colors.coolClay, fontSize: 12, marginTop: 4, textTransform: "uppercase" },
  profesional: { color: colors.nettleGreen, marginTop: 4 },
  precio: { color: colors.sugoDellaNonna, marginTop: 4, fontWeight: "600" },
});