import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { supabase } from "../../src/services/supabase";
import { Category } from "../../src/types/category";

export default function BuscarScreen() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarCategorias() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, nombre, slug");

      if (error) {
        setError(error.message);
      } else {
        setCategorias(data ?? []);
      }
      setCargando(false);
    }

    cargarCategorias();
  }, []);

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text>Cargando categorías...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.nombre}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  item: {
    fontSize: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});