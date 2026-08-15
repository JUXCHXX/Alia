import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { buscarServicios, ServicioConDetalle } from "../../src/services/services";
import { getCategorias } from "../../src/services/categories";
import { Category } from "../../src/types/category";
import { colors } from "../../src/constants/colors";

export default function BuscarServiciosScreen() {
  const [query, setQuery] = useState("");
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [precioMax, setPrecioMax] = useState("");
  const [resultados, setResultados] = useState<ServicioConDetalle[]>([]);
  const [cargando, setCargando] = useState(false);
  const [buscoAlgunaVez, setBuscoAlgunaVez] = useState(false);

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  async function handleBuscar() {
    setCargando(true);
    setBuscoAlgunaVez(true);
    try {
      const data = await buscarServicios({
        query,
        categoryId: categoriaId,
        precioMax: precioMax ? parseFloat(precioMax) : null,
      });
      setResultados(data);
    } finally {
      setCargando(false);
    }
  }

  function limpiarFiltros() {
    setCategoriaId(null);
    setPrecioMax("");
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="¿Qué necesitas? Ej: electricista, corte de cabello..."
        placeholderTextColor={colors.coolClay}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleBuscar}
        returnKeyType="search"
      />

      <Text style={styles.etiqueta}>Categoría</Text>
      <View style={styles.chips}>
        {categorias.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setCategoriaId(categoriaId === cat.id ? null : cat.id)}
            style={[styles.chip, categoriaId === cat.id && styles.chipSeleccionado]}
          >
            <Text
              style={[
                styles.chipTexto,
                categoriaId === cat.id && styles.chipTextoSeleccionado,
              ]}
            >
              {cat.nombre}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.etiqueta}>Precio máximo (COP)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 50000"
        placeholderTextColor={colors.coolClay}
        value={precioMax}
        onChangeText={setPrecioMax}
        keyboardType="numeric"
      />

      <View style={styles.botones}>
        <Pressable style={styles.botonBuscar} onPress={handleBuscar}>
          <Text style={styles.botonBuscarTexto}>Buscar</Text>
        </Pressable>
        <Pressable style={styles.botonLimpiar} onPress={limpiarFiltros}>
          <Text style={styles.botonLimpiarTexto}>Limpiar filtros</Text>
        </Pressable>
      </View>

      {cargando ? (
        <ActivityIndicator color={colors.lionfishRed} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            buscoAlgunaVez ? (
              <Text style={styles.vacio}>No encontramos servicios con esos filtros.</Text>
            ) : null
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.quartzite,
  },
  etiqueta: { color: colors.quartzite, marginBottom: 8, fontWeight: "600", fontSize: 13 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipSeleccionado: { backgroundColor: colors.nettleGreen, borderColor: colors.nettleGreen },
  chipTexto: { color: colors.quartzite, fontSize: 13 },
  chipTextoSeleccionado: { color: "white" },
  botones: { flexDirection: "row", gap: 10, marginBottom: 16 },
  botonBuscar: {
    flex: 1,
    backgroundColor: colors.lionfishRed,
    padding: 12,
    borderRadius: 8,
  },
  botonBuscarTexto: { color: "white", textAlign: "center", fontWeight: "600" },
  botonLimpiar: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.coolClay,
    padding: 12,
    borderRadius: 8,
  },
  botonLimpiarTexto: { color: colors.quartzite, textAlign: "center", fontWeight: "600" },
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