import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getMisServicios, cambiarEstadoServicio } from "../../src/services/services";
import { Service } from "../../src/types/service";
import { colors } from "../../src/constants/colors";

export default function MisServiciosScreen() {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarServicios = useCallback(() => {
    getMisServicios()
      .then(setServicios)
      .finally(() => setCargando(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarServicios();
    }, [cargarServicios])
  );

  function confirmarCambioEstado(servicio: Service) {
    const accion = servicio.activo ? "desactivar" : "activar";
    Alert.alert(
      `${accion === "desactivar" ? "Desactivar" : "Activar"} servicio`,
      servicio.activo
        ? "Dejará de aparecer en las búsquedas de clientes. Puedes activarlo de nuevo cuando quieras."
        : "Volverá a aparecer en las búsquedas de clientes.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: accion === "desactivar" ? "Desactivar" : "Activar",
          style: servicio.activo ? "destructive" : "default",
          onPress: async () => {
            try {
              await cambiarEstadoServicio(servicio.id, !servicio.activo);
              cargarServicios();
            } catch (err: any) {
              Alert.alert("Error", err.message ?? "No se pudo actualizar.");
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
        data={servicios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no has publicado servicios.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.cardInfo}
              onPress={() =>
                router.push({
                  pathname: "/servicios/editar",
                  params: {
                    id: item.id,
                    nombre: item.nombre,
                    descripcion: item.descripcion ?? "",
                    precio: String(item.precio),
                    category_id: item.category_id,
                  },
                })
              }
            >
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.precio}>
                ${item.precio.toLocaleString("es-CO")}
              </Text>
              <Text style={styles.estado}>
                {item.activo ? "Activo" : "Inactivo"}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.botonEstado,
                item.activo ? styles.botonDesactivar : styles.botonActivar,
              ]}
              onPress={() => confirmarCambioEstado(item)}
            >
              <Text style={styles.botonEstadoTexto}>
                {item.activo ? "Desactivar" : "Activar"}
              </Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable
        style={styles.botonFlotante}
        onPress={() => router.push("/servicios/crear")}
      >
        <Text style={styles.botonFlotanteTexto}>+ Nuevo servicio</Text>
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
    marginBottom: 12,
    overflow: "hidden",
  },
  cardInfo: { padding: 16 },
  nombre: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  precio: { color: colors.nettleGreen, marginTop: 4 },
  estado: { color: colors.coolClay, fontSize: 12, marginTop: 4, textTransform: "uppercase" },
  botonEstado: { paddingVertical: 10, alignItems: "center" },
  botonDesactivar: { backgroundColor: colors.sugoDellaNonna },
  botonActivar: { backgroundColor: colors.nettleGreen },
  botonEstadoTexto: { color: "white", fontWeight: "600", fontSize: 13 },
  botonFlotante: {
    backgroundColor: colors.lionfishRed,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  botonFlotanteTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});