import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getCategorias } from "../../src/services/categories";
import { Category } from "../../src/types/category";
import { colors } from "../../src/constants/colors";

export default function BuscarScreen() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch(() => setError("No se pudieron cargar las categorías."))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Explorar categorías</Text>

      <Pressable onPress={() => router.push("/profesionales")}>
        <Text style={styles.verTodos}>Ver todos los profesionales →</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/servicios/todos")}>
        <Text style={styles.verTodos}>Ver todos los servicios →</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/servicios/buscar")}>
        <Text style={styles.verTodos}>🔍 Buscar por nombre</Text>
      </Pressable>

      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/categorias/[id]",
                params: { id: item.id, nombre: item.nombre },
              })
            }
          >
            <Text style={styles.cardTexto}>{item.nombre}</Text>
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
  verTodos: { color: colors.nettleGreen, marginBottom: 16, fontWeight: "600" },
  error: { color: colors.sugoDellaNonna },
  card: {
    flex: 1,
    backgroundColor: colors.nettleGreen,
    borderRadius: 12,
    padding: 20,
    minHeight: 90,
    justifyContent: "flex-end",
  },
  cardTexto: { color: "white", fontWeight: "600", fontSize: 15 },
});