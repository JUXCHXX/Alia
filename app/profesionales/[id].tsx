import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getPerfilProfesionalPublico,
  PerfilProfesionalPublico,
} from "../../src/services/professionalProfiles";
import { getServiciosDeProfesional } from "../../src/services/services";
import { Service } from "../../src/types/service";
import { colors } from "../../src/constants/colors";

export default function PerfilProfesionalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [perfil, setPerfil] = useState<PerfilProfesionalPublico | null>(null);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([getPerfilProfesionalPublico(id), getServiciosDeProfesional(id)])
      .then(([perfilData, serviciosData]) => {
        setPerfil(perfilData);
        setServicios(serviciosData);
      })
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>No se pudo cargar este perfil.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={servicios}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View style={styles.header}>
          {perfil.foto_url ? (
            <Image source={{ uri: perfil.foto_url }} style={styles.foto} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.fotoIniciales}>
                {perfil.nombre.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.nombre}>{perfil.nombre}</Text>
          {perfil.zona_trabajo && (
            <Text style={styles.zona}>{perfil.zona_trabajo}</Text>
          )}
          {perfil.bio && <Text style={styles.bio}>{perfil.bio}</Text>}
          <Text style={styles.subtitulo}>Servicios</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.vacio}>Sin servicios activos por ahora.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.servicioNombre}>{item.nombre}</Text>
          {item.descripcion && (
            <Text style={styles.servicioDescripcion}>{item.descripcion}</Text>
          )}
          <Text style={styles.precio}>
            ${item.precio.toLocaleString("es-CO")}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, backgroundColor: "#fff", flexGrow: 1 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: colors.sugoDellaNonna },
  header: { alignItems: "center", marginBottom: 24 },
  foto: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  fotoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.nettleGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  fotoIniciales: { color: "white", fontSize: 36, fontWeight: "600" },
  nombre: { fontSize: 22, fontWeight: "600", color: colors.quartzite },
  zona: { color: colors.coolClay, marginTop: 4 },
  bio: { color: colors.quartzite, textAlign: "center", marginTop: 12 },
  subtitulo: { alignSelf: "flex-start", fontSize: 16, fontWeight: "600", color: colors.quartzite, marginTop: 24 },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 20 },
  card: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  servicioNombre: { fontSize: 16, fontWeight: "600", color: colors.quartzite },
  servicioDescripcion: { color: colors.coolClay, marginTop: 4 },
  precio: { color: colors.nettleGreen, marginTop: 6, fontWeight: "600" },
});