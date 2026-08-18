import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { crearReporte } from "../../src/services/reports";
import { MotivoReporte } from "../../src/types/report";
import { colors } from "../../src/constants/colors";

const MOTIVOS: { valor: MotivoReporte; etiqueta: string }[] = [
  { valor: "comportamiento", etiqueta: "Comportamiento inapropiado" },
  { valor: "servicio_no_realizado", etiqueta: "Servicio no realizado" },
  { valor: "fraude", etiqueta: "Fraude o engaño" },
  { valor: "contenido_inapropiado", etiqueta: "Contenido inapropiado" },
  { valor: "otro", etiqueta: "Otro" },
];

export default function ReportarScreen() {
  const { bookingId, reportadoId, nombreReportado } = useLocalSearchParams<{
    bookingId: string;
    reportadoId: string;
    nombreReportado: string;
  }>();

  const [motivo, setMotivo] = useState<MotivoReporte | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleEnviar() {
    if (!motivo) {
      Alert.alert("Falta el motivo", "Selecciona por qué estás reportando.");
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert("Falta la descripción", "Cuéntanos qué pasó.");
      return;
    }

    setEnviando(true);
    try {
      await crearReporte({
        reportadoId,
        bookingId,
        motivo,
        descripcion: descripcion.trim(),
      });
      Alert.alert(
        "Reporte enviado",
        "Vamos a revisarlo. Gracias por ayudarnos a mantener Alía segura."
      );
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo enviar el reporte.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reportar a {nombreReportado}</Text>

      <Text style={styles.etiqueta}>Motivo</Text>
      <View style={styles.opciones}>
        {MOTIVOS.map((m) => (
          <Pressable
            key={m.valor}
            style={[styles.opcion, motivo === m.valor && styles.opcionSeleccionada]}
            onPress={() => setMotivo(m.valor)}
          >
            <Text
              style={[
                styles.opcionTexto,
                motivo === m.valor && styles.opcionTextoSeleccionado,
              ]}
            >
              {m.etiqueta}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.etiqueta}>Describe lo que pasó</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Cuéntanos con detalle..."
        placeholderTextColor={colors.coolClay}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Pressable style={styles.boton} onPress={handleEnviar} disabled={enviando}>
        <Text style={styles.botonTexto}>
          {enviando ? "Enviando..." : "Enviar reporte"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: "#fff" },
  titulo: { fontSize: 20, fontWeight: "600", marginBottom: 20, textAlign: "center", color: colors.quartzite },
  etiqueta: { color: colors.quartzite, marginBottom: 8, fontWeight: "600" },
  opciones: { marginBottom: 20 },
  opcion: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  opcionSeleccionada: { backgroundColor: colors.sugoDellaNonna, borderColor: colors.sugoDellaNonna },
  opcionTexto: { color: colors.quartzite },
  opcionTextoSeleccionado: { color: "white", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: colors.quartzite,
  },
  textarea: { height: 100, textAlignVertical: "top" },
  boton: { backgroundColor: colors.sugoDellaNonna, padding: 14, borderRadius: 8 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});