import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getServiciosPorCategoria, ServicioConProfesional } from "../../src/services/services";
import { colors } from "../../src/constants/colors";
import { router } from "expo-router";

export default function CategoriaDetalleScreen() {
  const { id, nombre } = useLocalSearchParams<{ id: string; nombre: string }>();
  const [servicios, setServicios] = useState<ServicioConProfesional[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getServiciosPorCategoria(id)
      .then(setServicios)
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nombre}</Text>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            Todavía no hay servicios activos en esta categoría.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/profesionales/[id]",
                  params: { id: item.professional_id },
                })
              }
            >
              <Text style={styles.profesional}>
                {item.profiles?.nombre ?? "Profesional"}
              </Text>
            </Pressable>
            <Text style={styles.precio}>
              ${item.precio.toLocaleString("es-CO")}
            </Text>
          </View>
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
  profesional: { color: colors.nettleGreen, marginTop: 4 },
  precio: { color: colors.sugoDellaNonna, marginTop: 4, fontWeight: "600" },
});