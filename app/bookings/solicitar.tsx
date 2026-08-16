import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { crearSolicitud } from "../../src/services/bookings";
import { colors } from "../../src/constants/colors";

export default function SolicitarServicioScreen() {
  const { serviceId, professionalId, nombreServicio, precio } = useLocalSearchParams<{
    serviceId: string;
    professionalId: string;
    nombreServicio: string;
    precio: string;
  }>();

  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSolicitar() {
    if (!mensaje.trim()) {
      Alert.alert("Falta el mensaje", "Cuéntale al profesional qué necesitas.");
      return;
    }

    setEnviando(true);
    try {
      await crearSolicitud({
        serviceId,
        professionalId,
        mensaje: mensaje.trim(),
      });
      Alert.alert(
        "Solicitud enviada",
        "El profesional recibirá tu solicitud y podrá aceptarla o rechazarla."
      );
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo enviar la solicitud.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Solicitar servicio</Text>
      <Text style={styles.servicio}>{nombreServicio}</Text>
      <Text style={styles.precio}>${Number(precio).toLocaleString("es-CO")}</Text>

      <Text style={styles.etiqueta}>Cuéntale al profesional qué necesitas</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Ej: Necesito revisar una fuga en el baño, disponible los fines de semana..."
        placeholderTextColor={colors.coolClay}
        value={mensaje}
        onChangeText={setMensaje}
        multiline
      />

      <Pressable style={styles.boton} onPress={handleSolicitar} disabled={enviando}>
        <Text style={styles.botonTexto}>
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "600", marginBottom: 8, textAlign: "center", color: colors.quartzite },
  servicio: { fontSize: 16, fontWeight: "600", textAlign: "center", color: colors.quartzite, marginTop: 16 },
  precio: { textAlign: "center", color: colors.nettleGreen, marginBottom: 24 },
  etiqueta: { color: colors.quartzite, marginBottom: 8, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: colors.quartzite,
  },
  textarea: { height: 120, textAlignVertical: "top" },
  boton: { backgroundColor: colors.lionfishRed, padding: 14, borderRadius: 8 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});