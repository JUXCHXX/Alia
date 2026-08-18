import { useState } from "react";
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { crearCalificacion, subirFotoReview } from "../../src/services/reviews";
import { colors } from "../../src/constants/colors";

export default function CalificarScreen() {
  const { bookingId, nombreProfesional } = useLocalSearchParams<{
    bookingId: string;
    nombreProfesional: string;
  }>();

  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [fotoLocal, setFotoLocal] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function elegirFoto() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tus fotos.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
    });

    if (!resultado.canceled) {
      setFotoLocal(resultado.assets[0].uri);
    }
  }

  async function handleEnviar() {
    if (calificacion === 0) {
      Alert.alert("Falta la calificación", "Selecciona de 1 a 5 estrellas.");
      return;
    }

    setEnviando(true);
    try {
      let fotoUrl: string | undefined;
      if (fotoLocal) {
        fotoUrl = await subirFotoReview(fotoLocal, bookingId);
      }

      await crearCalificacion({
        bookingId,
        calificacion,
        comentario: comentario.trim(),
        fotoUrl,
      });

      Alert.alert("Gracias por calificar", "Tu opinión ayuda a otros clientes.");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo enviar la calificación.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Califica el servicio</Text>
      <Text style={styles.subtitulo}>{nombreProfesional}</Text>

      <View style={styles.estrellas}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setCalificacion(n)}>
            <Text style={[styles.estrella, n <= calificacion && styles.estrellaActiva]}>
              ★
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Cuéntanos cómo te fue (opcional)"
        placeholderTextColor={colors.coolClay}
        value={comentario}
        onChangeText={setComentario}
        multiline
      />

      <Pressable onPress={elegirFoto} style={styles.fotoContainer}>
        {fotoLocal ? (
          <Image source={{ uri: fotoLocal }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Text style={styles.fotoTexto}>Agregar foto (opcional)</Text>
          </View>
        )}
      </Pressable>

      <Pressable style={styles.boton} onPress={handleEnviar} disabled={enviando}>
        <Text style={styles.botonTexto}>
          {enviando ? "Enviando..." : "Enviar calificación"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "600", textAlign: "center", color: colors.quartzite },
  subtitulo: { textAlign: "center", color: colors.nettleGreen, marginBottom: 20 },
  estrellas: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 },
  estrella: { fontSize: 36, color: colors.coolClay },
  estrellaActiva: { color: colors.lionfishRed },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: colors.quartzite,
  },
  textarea: { height: 90, textAlignVertical: "top" },
  fotoContainer: { marginBottom: 20, alignItems: "center" },
  foto: { width: 120, height: 120, borderRadius: 8 },
  fotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.coolClay,
    alignItems: "center",
    justifyContent: "center",
  },
  fotoTexto: { color: "white", fontSize: 12, textAlign: "center", paddingHorizontal: 8 },
  boton: { backgroundColor: colors.lionfishRed, padding: 14, borderRadius: 8 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});