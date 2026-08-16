import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import {
  getMiDisponibilidad,
  cambiarEstadoBloque,
  eliminarBloqueDisponibilidad,
} from "../../src/services/availability";
import { AvailabilityBlock, DIAS_SEMANA } from "../../src/types/availability";
import { colors } from "../../src/constants/colors";

export default function DisponibilidadScreen() {
  const [bloques, setBloques] = useState<AvailabilityBlock[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarBloques = useCallback(() => {
    getMiDisponibilidad()
      .then(setBloques)
      .finally(() => setCargando(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarBloques();
    }, [cargarBloques])
  );

  function confirmarCambioEstado(bloque: AvailabilityBlock) {
    const accion = bloque.activo ? "desactivar" : "activar";
    Alert.alert(
      `${accion === "desactivar" ? "Desactivar" : "Activar"} horario`,
      bloque.activo
        ? "Dejará de mostrarse como disponible. Puedes activarlo de nuevo cuando quieras."
        : "Volverá a mostrarse como disponible.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: accion === "desactivar" ? "Desactivar" : "Activar",
          style: bloque.activo ? "destructive" : "default",
          onPress: async () => {
            try {
              await cambiarEstadoBloque(bloque.id, !bloque.activo);
              cargarBloques();
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "No se pudo actualizar.");
            }
          },
        },
      ]
    );
  }

  function confirmarEliminar(bloque: AvailabilityBlock) {
    Alert.alert(
      "Eliminar horario",
      `¿Eliminar el bloque de ${DIAS_SEMANA[bloque.dia_semana]} ${bloque.hora_inicio.slice(0, 5)}-${bloque.hora_fin.slice(0, 5)}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarBloqueDisponibilidad(bloque.id);
              cargarBloques();
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "No se pudo eliminar.");
            }
          },
        },
      ]
    );
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
      <FlatList
        data={bloques}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no has definido tu horario.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.dia}>{DIAS_SEMANA[item.dia_semana]}</Text>
              <Text style={styles.hora}>
                {item.hora_inicio.slice(0, 5)} - {item.hora_fin.slice(0, 5)}
              </Text>
              <Text style={styles.estado}>
                {item.activo ? "Activo" : "Inactivo"}
              </Text>
            </View>

            <View style={styles.acciones}>
              <Pressable
                style={[
                  styles.botonAccion,
                  item.activo ? styles.botonDesactivar : styles.botonActivar,
                ]}
                onPress={() => confirmarCambioEstado(item)}
              >
                <Text style={styles.botonAccionTexto}>
                  {item.activo ? "Desactivar" : "Activar"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.botonEliminar}
                onPress={() => confirmarEliminar(item)}
              >
                <Text style={styles.botonEliminarTexto}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable
        style={styles.botonFlotante}
        onPress={() => router.push("/disponibilidad/agregar")}
      >
        <Text style={styles.botonFlotanteTexto}>+ Agregar horario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 40 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  info: { marginBottom: 12 },
  dia: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  hora: { color: colors.nettleGreen, marginTop: 4 },
  estado: { color: colors.coolClay, fontSize: 12, marginTop: 4, textTransform: "uppercase" },
  acciones: { flexDirection: "row", gap: 8 },
  botonAccion: { flex: 1, paddingVertical: 8, borderRadius: 6 },
  botonDesactivar: { backgroundColor: colors.sugoDellaNonna },
  botonActivar: { backgroundColor: colors.nettleGreen },
  botonAccionTexto: { color: "white", textAlign: "center", fontSize: 13, fontWeight: "600" },
  botonEliminar: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.sugoDellaNonna,
  },
  botonEliminarTexto: { color: colors.sugoDellaNonna, textAlign: "center", fontSize: 13, fontWeight: "600" },
  botonFlotante: {
    backgroundColor: colors.lionfishRed,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  botonFlotanteTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});