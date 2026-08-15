import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getProfesionales, ProfesionalResumen } from "../../src/services/professionalProfiles";
import { colors } from "../../src/constants/colors";

export default function ProfesionalesScreen() {
  const [profesionales, setProfesionales] = useState<ProfesionalResumen[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getProfesionales()
      .then(setProfesionales)
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Todos los profesionales</Text>
      <FlatList
        data={profesionales}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no hay profesionales aprobados.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/profesionales/[id]", params: { id: item.id } })
            }
          >
            {item.foto_url ? (
              <Image source={{ uri: item.foto_url }} style={styles.foto} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Text style={styles.fotoIniciales}>
                  {item.nombre.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View>
              <Text style={styles.nombre}>{item.nombre}</Text>
              {item.zona_trabajo && (
                <Text style={styles.zona}>{item.zona_trabajo}</Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 22, fontWeight: "600", color: colors.quartzite, marginBottom: 16 },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  foto: { width: 48, height: 48, borderRadius: 24 },
  fotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.nettleGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  fotoIniciales: { color: "white", fontWeight: "600" },
  nombre: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  zona: { color: colors.coolClay, fontSize: 13, marginTop: 2 },
});