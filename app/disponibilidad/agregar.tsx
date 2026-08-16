import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { crearBloqueDisponibilidad } from "../../src/services/availability";
import { DIAS_SEMANA } from "../../src/types/availability";
import { colors } from "../../src/constants/colors";

const REGEX_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

function formatearHora(texto: string): string {
  const soloDigitos = texto.replace(/\D/g, "").slice(0, 4);
  if (soloDigitos.length <= 2) return soloDigitos;
  return `${soloDigitos.slice(0, 2)}:${soloDigitos.slice(2)}`;
}

export default function AgregarDisponibilidadScreen() {
  const [diaSemana, setDiaSemana] = useState<number | null>(null);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function handleGuardar() {
    if (diaSemana === null) {
      Alert.alert("Falta el día", "Elige un día de la semana.");
      return;
    }
    if (!REGEX_HORA.test(horaInicio) || !REGEX_HORA.test(horaFin)) {
      Alert.alert("Formato inválido", "Completa la hora en formato de 24h, ej. 0800 para las 8:00 am.");
      return;
    }
    if (horaFin <= horaInicio) {
      Alert.alert("Horario inválido", "La hora de fin debe ser después de la de inicio.");
      return;
    }

    setGuardando(true);
    try {
      await crearBloqueDisponibilidad({
        dia_semana: diaSemana,
        hora_inicio: `${horaInicio}:00`,
        hora_fin: `${horaFin}:00`,
      });
      router.back();
   } catch (err: any) {
     if (err.message?.includes("se superpone")) {
       Alert.alert(
         "Horario superpuesto",
         "Ya tienes un bloque que se cruza con este horario. Edítalo o elimínalo primero."
      );
     } else {
       Alert.alert("Error", err.message ?? "No se pudo guardar.");
    }
  } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar horario</Text>

      <Text style={styles.etiqueta}>Día</Text>
      <View style={styles.chips}>
        {DIAS_SEMANA.map((dia, index) => (
          <Pressable
            key={dia}
            onPress={() => setDiaSemana(index)}
            style={[styles.chip, diaSemana === index && styles.chipSeleccionado]}
          >
            <Text
              style={[
                styles.chipTexto,
                diaSemana === index && styles.chipTextoSeleccionado,
              ]}
            >
              {dia.slice(0, 3)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.etiqueta}>Desde (formato 24h, ej. 0800)</Text>
      <TextInput
        style={styles.input}
        placeholder="08:00"
        placeholderTextColor={colors.coolClay}
        value={horaInicio}
        onChangeText={(texto) => setHoraInicio(formatearHora(texto))}
        keyboardType="number-pad"
        maxLength={5}
      />

      <Text style={styles.etiqueta}>Hasta (formato 24h, ej. 1700)</Text>
      <TextInput
        style={styles.input}
        placeholder="17:00"
        placeholderTextColor={colors.coolClay}
        value={horaFin}
        onChangeText={(texto) => setHoraFin(formatearHora(texto))}
        keyboardType="number-pad"
        maxLength={5}
      />

      <Pressable style={styles.boton} onPress={handleGuardar} disabled={guardando}>
        <Text style={styles.botonTexto}>
          {guardando ? "Guardando..." : "Guardar horario"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center", color: colors.quartzite },
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
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: colors.quartzite,
  },
  boton: { backgroundColor: colors.lionfishRed, padding: 14, borderRadius: 8 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});