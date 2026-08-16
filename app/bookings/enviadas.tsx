import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import {
  getMisSolicitudesEnviadas,
  cancelarSolicitud,
  SolicitudEnviada,
} from "../../src/services/bookings";
import { colors } from "../../src/constants/colors";

const ETIQUETA_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export default function MisSolicitudesEnviadasScreen() {
  const [solicitudes, setSolicitudes] = useState<SolicitudEnviada[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = useCallback(() => {
    getMisSolicitudesEnviadas()
      .then(setSolicitudes)
      .finally(() => setCargando(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarSolicitudes();
    }, [cargarSolicitudes])
  );

  function confirmarCancelar(id: string) {
    Alert.alert(
      "Cancelar solicitud",
      "¿Seguro que quieres cancelar esta solicitud?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelarSolicitud(id);
              cargarSolicitudes();
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "No se pudo cancelar.");
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
          <Text style={styles.vacio}>Aún no has solicitado ningún servicio.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.profesional}>
              {item.profiles?.nombre ?? "Profesional"}
            </Text>
            <Text style={styles.servicio}>
              {item.services?.nombre ?? "Servicio"}
            </Text>
            <Text style={styles.estado}>{ETIQUETA_ESTADO[item.estado]}</Text>

            {(item.estado === "pendiente" || item.estado === "aceptada") && (
              <Pressable
                style={styles.botonCancelar}
                onPress={() => confirmarCancelar(item.id)}
              >
                <Text style={styles.botonCancelarTexto}>Cancelar solicitud</Text>
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
  profesional: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  servicio: { color: colors.nettleGreen, marginTop: 4 },
  estado: { color: colors.coolClay, fontSize: 12, marginTop: 8, textTransform: "uppercase" },
  botonCancelar: {
    borderWidth: 1,
    borderColor: colors.sugoDellaNonna,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  botonCancelarTexto: { color: colors.sugoDellaNonna, textAlign: "center", fontWeight: "600" },
  botonChat: {
    borderWidth: 1,
    borderColor: colors.nettleGreen,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  botonChatTexto: { color: colors.nettleGreen, textAlign: "center", fontWeight: "600" },
});