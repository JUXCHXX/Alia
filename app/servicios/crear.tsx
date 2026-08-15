import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { crearServicio } from "../../src/services/services";
import { getCategorias } from "../../src/services/categories";
import { Category } from "../../src/types/category";
import { colors } from "../../src/constants/colors";

export default function CrearServicioScreen() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {
      Alert.alert("Error", "No se pudieron cargar las categorías.");
    });
  }, []);

  async function handleCrear() {
    if (!nombre.trim() || !categoriaId) {
      Alert.alert("Faltan datos", "Ingresa un nombre y elige una categoría.");
      return;
    }

    const precioNumerico = parseFloat(precio.replace(",", "."));
    if (isNaN(precioNumerico) || precioNumerico < 0) {
      Alert.alert("Precio inválido", "Ingresa un precio válido.");
      return;
    }

    setGuardando(true);
    try {
      await crearServicio({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNumerico,
        category_id: categoriaId,
      });
      Alert.alert("Listo", "Tu servicio fue publicado.");
      router.back();
    } catch (err: any) {
      if (err.message?.includes("row-level security")) {
        Alert.alert(
          "No autorizado",
          "Solo profesionales aprobados pueden publicar servicios."
        );
      } else {
        Alert.alert("Error", err.message ?? "No se pudo crear el servicio.");
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Publicar servicio</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del servicio"
        placeholderTextColor={colors.coolClay}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Descripción"
        placeholderTextColor={colors.coolClay}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Precio (COP)"
        placeholderTextColor={colors.coolClay}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <Text style={styles.etiqueta}>Categoría</Text>
      <View style={styles.chips}>
        {categorias.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setCategoriaId(cat.id)}
            style={[
              styles.chip,
              categoriaId === cat.id && styles.chipSeleccionado,
            ]}
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

      <Pressable style={styles.boton} onPress={handleCrear} disabled={guardando}>
        <Text style={styles.botonTexto}>
          {guardando ? "Publicando..." : "Publicar servicio"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  titulo: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center", color: colors.quartzite },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.quartzite,
  },
  textarea: { height: 80, textAlignVertical: "top" },
  etiqueta: { color: colors.quartzite, marginBottom: 8, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipSeleccionado: { backgroundColor: colors.nettleGreen, borderColor: colors.nettleGreen },
  chipTexto: { color: colors.quartzite },
  chipTextoSeleccionado: { color: "white" },
  boton: { backgroundColor: colors.lionfishRed, padding: 14, borderRadius: 8 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});