import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getMisDatosBancarios, actualizarDatosBancarios } from "../../src/services/professionalProfiles";
import { colors } from "../../src/constants/colors";

export default function DatosBancariosScreen() {
  const [banco, setBanco] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState<"ahorros" | "corriente">("ahorros");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [titularCuenta, setTitularCuenta] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getMisDatosBancarios()
      .then((data) => {
        setBanco(data.banco ?? "");
        setTipoCuenta((data.tipo_cuenta as "ahorros" | "corriente") ?? "ahorros");
        setNumeroCuenta(data.numero_cuenta ?? "");
        setTitularCuenta(data.titular_cuenta ?? "");
      })
      .finally(() => setCargando(false));
  }, []);

  async function handleGuardar() {
    if (!banco.trim() || !numeroCuenta.trim() || !titularCuenta.trim()) {
      Alert.alert("Faltan datos", "Completa banco, número de cuenta y titular.");
      return;
    }

    setGuardando(true);
    try {
      await actualizarDatosBancarios({
        banco: banco.trim(),
        tipoCuenta,
        numeroCuenta: numeroCuenta.trim(),
        titularCuenta: titularCuenta.trim(),
      });
      Alert.alert("Listo", "Tus datos bancarios fueron guardados.");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Datos bancarios</Text>
      <Text style={styles.subtitulo}>
        Aquí es donde te vamos a transferir tus pagos por servicios completados.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Banco (ej. Bancolombia)"
        placeholderTextColor={colors.coolClay}
        value={banco}
        onChangeText={setBanco}
      />

      <View style={styles.chips}>
        <Pressable
          style={[styles.chip, tipoCuenta === "ahorros" && styles.chipSeleccionado]}
          onPress={() => setTipoCuenta("ahorros")}
        >
          <Text style={[styles.chipTexto, tipoCuenta === "ahorros" && styles.chipTextoSeleccionado]}>
            Ahorros
          </Text>
        </Pressable>
        <Pressable
          style={[styles.chip, tipoCuenta === "corriente" && styles.chipSeleccionado]}
          onPress={() => setTipoCuenta("corriente")}
        >
          <Text style={[styles.chipTexto, tipoCuenta === "corriente" && styles.chipTextoSeleccionado]}>
            Corriente
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Número de cuenta"
        placeholderTextColor={colors.coolClay}
        value={numeroCuenta}
        onChangeText={setNumeroCuenta}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre del titular de la cuenta"
        placeholderTextColor={colors.coolClay}
        value={titularCuenta}
        onChangeText={setTitularCuenta}
      />

      <Pressable style={styles.boton} onPress={handleGuardar} disabled={guardando}>
        <Text style={styles.botonTexto}>
          {guardando ? "Guardando..." : "Guardar datos bancarios"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 22, fontWeight: "600", textAlign: "center", color: colors.quartzite },
  subtitulo: { textAlign: "center", color: colors.nettleGreen, marginTop: 8, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.quartzite,
  },
  chips: { flexDirection: "row", gap: 10, marginBottom: 12 },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  chipSeleccionado: { backgroundColor: colors.nettleGreen, borderColor: colors.nettleGreen },
  chipTexto: { color: colors.quartzite },
  chipTextoSeleccionado: { color: "white", fontWeight: "600" },
  boton: { backgroundColor: colors.lionfishRed, padding: 14, borderRadius: 8, marginTop: 12 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});