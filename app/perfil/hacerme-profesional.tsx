import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getMiPerfilProfesional, solicitarSerProfesional } from "../../src/services/professionalProfiles";
import { ProfessionalProfile } from "../../src/types/professionalProfile";
import { colors } from "../../src/constants/colors";

export default function HacermeProfesionalScreen() {
  const [perfilExistente, setPerfilExistente] = useState<ProfessionalProfile | null>(null);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [bio, setBio] = useState("");
  const [zonaTrabajo, setZonaTrabajo] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getMiPerfilProfesional()
      .then(setPerfilExistente)
      .finally(() => setCargandoInicial(false));
  }, []);

  async function handleEnviar() {
    if (!bio.trim() || !zonaTrabajo.trim()) {
      Alert.alert("Faltan datos", "Cuéntanos sobre ti y tu zona de trabajo.");
      return;
    }

    setEnviando(true);
    try {
      await solicitarSerProfesional(bio.trim(), zonaTrabajo.trim());
      Alert.alert(
        "Solicitud enviada",
        "Tu perfil será revisado en un plazo de hasta 7 días hábiles."
      );
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo enviar la solicitud.");
    } finally {
      setEnviando(false);
    }
  }

  if (cargandoInicial) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  if (perfilExistente) {
    const mensajes = {
      pendiente: "Tu solicitud está en revisión. Te avisaremos en un plazo de hasta 7 días hábiles.",
      aprobado: "¡Tu perfil profesional ya está aprobado!",
      rechazado: "Tu solicitud fue rechazada. Puedes escribirnos para más información.",
    };

    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Estado de tu solicitud</Text>
        <Text style={styles.estado}>{mensajes[perfilExistente.estado_verificacion]}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ofrece tus servicios en Alía</Text>
      <Text style={styles.subtitulo}>
        Cuéntanos sobre ti. Revisamos cada perfil en un plazo de hasta 7 días hábiles.
      </Text>

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Cuéntanos sobre tu experiencia..."
        placeholderTextColor={colors.coolClay}
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Zona donde trabajas (ej. Norte de Barranquilla)"
        placeholderTextColor={colors.coolClay}
        value={zonaTrabajo}
        onChangeText={setZonaTrabajo}
      />

      <Pressable style={styles.boton} onPress={handleEnviar} disabled={enviando}>
        <Text style={styles.botonTexto}>
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "600", marginBottom: 8, textAlign: "center", color: colors.quartzite },
  subtitulo: { textAlign: "center", marginBottom: 24, color: colors.nettleGreen },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.quartzite,
  },
  textarea: { height: 100, textAlignVertical: "top" },
  boton: { backgroundColor: colors.lionfishRed, padding: 14, borderRadius: 8, marginTop: 8 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
  estado: { textAlign: "center", color: colors.quartzite, fontSize: 16 },
});