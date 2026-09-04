import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfesionalesPendientes, aprobarProfesional, rechazarProfesional, ProfesionalAdmin } from "../../src/services/admin";
import { colors } from "../../src/constants/colors";

export default function ProfesionalesAdminScreen() {
  const [pendientes, setPendientes] = useState<ProfesionalAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [notaRechazo, setNotaRechazo] = useState<Record<string, string>>({});

  const cargar = useCallback(() => {
    getProfesionalesPendientes().then(setPendientes).finally(() => setCargando(false));
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  async function handleAprobar(id: string) {
    Alert.alert("Aprobar profesional", "¿Confirmas la aprobación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Aprobar",
        onPress: async () => {
          try {
            await aprobarProfesional(id);
            cargar();
          } catch (err: any) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  }

  async function handleRechazar(id: string) {
    const notas = notaRechazo[id]?.trim();
    if (!notas) {
      Alert.alert("Falta la nota", "Escribe el motivo del rechazo.");
      return;
    }
    try {
      await rechazarProfesional(id, notas);
      cargar();
    } catch (err: any) {
      Alert.alert("Error", err.message);
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={pendientes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListHeaderComponent={<Text style={styles.titulo}>Pendientes de aprobación ({pendientes.length})</Text>}
        ListEmptyComponent={<Text style={styles.vacio}>No hay solicitudes pendientes.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.profiles?.nombre ?? "Profesional"}</Text>
            <Text style={styles.dato}>{item.profiles?.telefono ?? "Sin teléfono"}</Text>
            <Text style={styles.dato}>Zona: {item.zona_trabajo ?? "No especificada"}</Text>
            {item.bio && <Text style={styles.bio}>{item.bio}</Text>}

            <Pressable style={styles.botonAprobar} onPress={() => handleAprobar(item.id)}>
              <Text style={styles.botonAprobarTexto}>Aprobar</Text>
            </Pressable>

            <TextInput
              style={styles.input}
              placeholder="Motivo si vas a rechazar..."
              placeholderTextColor={colors.coolClay}
              value={notaRechazo[item.id] ?? ""}
              onChangeText={(texto) => setNotaRechazo((prev) => ({ ...prev, [item.id]: texto }))}
            />
            <Pressable style={styles.botonRechazar} onPress={() => handleRechazar(item.id)}>
              <Text style={styles.botonRechazarTexto}>Rechazar</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 20, fontWeight: "600", color: colors.quartzite, marginBottom: 16 },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 40 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  nombre: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  dato: { color: colors.coolClay, marginTop: 4 },
  bio: { color: colors.quartzite, marginTop: 8, fontStyle: "italic" },
  botonAprobar: { backgroundColor: colors.nettleGreen, padding: 10, borderRadius: 6, marginTop: 12 },
  botonAprobarTexto: { color: "white", textAlign: "center", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 6,
    padding: 8,
    marginTop: 12,
    color: colors.quartzite,
  },
  botonRechazar: { borderWidth: 1, borderColor: colors.sugoDellaNonna, padding: 10, borderRadius: 6, marginTop: 8 },
  botonRechazarTexto: { color: colors.sugoDellaNonna, textAlign: "center", fontWeight: "600" },
});