import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import {
  getSolicitudesRecibidas,
  aceptarSolicitud,
  rechazarSolicitud,
  completarSolicitud,
  SolicitudRecibida,
} from "../../src/services/bookings";
import { colors } from "../../src/constants/colors";

const ETIQUETA_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export default function SolicitudesRecibidasScreen() {
  const [solicitudes, setSolicitudes] = useState<SolicitudRecibida[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = useCallback(() => {
    getSolicitudesRecibidas()
      .then(setSolicitudes)
      .finally(() => setCargando(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarSolicitudes();
    }, [cargarSolicitudes])
  );

  function confirmarAceptar(id: string) {
    Alert.alert(
      "Aceptar solicitud",
      "¿Confirmas que puedes atender esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: async () => {
            try {
              await aceptarSolicitud(id);
              cargarSolicitudes();
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "No se pudo aceptar.");
            }
          },
        },
      ]
    );
  }

  function confirmarRechazar(id: string) {
    Alert.alert(
      "Rechazar solicitud",
      "¿Seguro que quieres rechazar esta solicitud? El cliente será notificado.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: async () => {
            try {
              await rechazarSolicitud(id);
              cargarSolicitudes();
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "No se pudo rechazar.");
            }
          },
        },
      ]
    );
  }

  function confirmarCompletar(id: string) {
    Alert.alert(
      "Marcar como completado",
      "¿Confirmas que el servicio ya fue realizado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await completarSolicitud(id);
              cargarSolicitudes();
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "No se pudo completar.");
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
        data={solicitudes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no has recibido solicitudes.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cliente}>
              {item.profiles?.nombre ?? "Cliente"}
            </Text>
            <Text style={styles.servicio}>
              {item.services?.nombre ?? "Servicio"}
            </Text>
            {item.mensaje && (
              <Text style={styles.mensaje}>{item.mensaje}</Text>
            )}
            <Text style={styles.estado}>{ETIQUETA_ESTADO[item.estado]}</Text>

            {item.estado === "pendiente" && (
              <View style={styles.acciones}>
                <Pressable
                  style={styles.botonAceptar}
                  onPress={() => confirmarAceptar(item.id)}
                >
                  <Text style={styles.botonAceptarTexto}>Aceptar</Text>
                </Pressable>
                <Pressable
                  style={styles.botonRechazar}
                  onPress={() => confirmarRechazar(item.id)}
                >
                  <Text style={styles.botonRechazarTexto}>Rechazar</Text>
                </Pressable>
              </View>
            )}

            {item.estado === "aceptada" && (
              <Pressable
                style={styles.botonCompletar}
                onPress={() => confirmarCompletar(item.id)}
              >
                <Text style={styles.botonCompletarTexto}>Marcar como completado</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.botonChat}
              onPress={() => router.push({ pathname: "/bookings/[id]", params: { id: item.id } })}
            >
              <Text style={styles.botonChatTexto}>Abrir chat</Text>
            </Pressable>
          </View>
        )}
      />
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
  cliente: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  servicio: { color: colors.nettleGreen, marginTop: 4 },
  mensaje: { color: colors.quartzite, marginTop: 8, fontStyle: "italic" },
  estado: { color: colors.coolClay, fontSize: 12, marginTop: 8, textTransform: "uppercase" },
  acciones: { flexDirection: "row", gap: 8, marginTop: 10 },
  botonAceptar: {
    flex: 1,
    backgroundColor: colors.nettleGreen,
    paddingVertical: 8,
    borderRadius: 6,
  },
  botonAceptarTexto: { color: "white", textAlign: "center", fontWeight: "600" },
  botonRechazar: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.sugoDellaNonna,
    paddingVertical: 8,
    borderRadius: 6,
  },
  botonRechazarTexto: { color: colors.sugoDellaNonna, textAlign: "center", fontWeight: "600" },
  botonCompletar: {
    backgroundColor: colors.nettleGreen,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  botonCompletarTexto: { color: "white", textAlign: "center", fontWeight: "600" },
  botonChat: {
    borderWidth: 1,
    borderColor: colors.nettleGreen,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  botonChatTexto: { color: colors.nettleGreen, textAlign: "center", fontWeight: "600" },
});