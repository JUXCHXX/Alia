import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator, Image } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { supabase } from "../../src/services/supabase";
import { getMiPerfil } from "../../src/services/profiles";
import { Profile } from "../../src/types/profile";
import { colors } from "../../src/constants/colors";
import { Fondo } from "../../src/components/Fondo";

export default function PerfilScreen() {
  const [perfil, setPerfil] = useState<Profile | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [])
  );

  async function cargarPerfil() {
    setCargando(true);
    try {
      const data = await getMiPerfil();
      setPerfil(data);
    } catch (err) {
      setError("No se pudo cargar tu perfil.");
    } finally {
      setCargando(false);
    }
  }

  function confirmarCierreSesion() {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que quieres salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => supabase.auth.signOut(),
        },
      ]
    );
  }

  if (cargando) {
    return (
      <Fondo source={require("../../assets/images/fondo_app.png")}>
        <View style={styles.container}>
          <ActivityIndicator color={colors.lionfishRed} />
        </View>
      </Fondo>
    );
  }

  if (error || !perfil) {
    return (
      <Fondo source={require("../../assets/images/fondo_app.png")}>
        <View style={styles.container}>
          <Text style={styles.errorTexto}>{error ?? "Perfil no encontrado."}</Text>
        </View>
      </Fondo>
    );
  }

  return (
    <Fondo source={require("../../assets/images/fondo_app.png")}>
      <View style={styles.container}>
        <View style={styles.tarjeta}>
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
          <Text style={styles.rol}>
            {perfil.rol === "cliente" ? "Cliente" : "Profesional"}
          </Text>

          <View style={styles.datos}>
            <Text style={styles.dato}>Ciudad: {perfil.ciudad ?? "No especificada"}</Text>
            <Text style={styles.dato}>Teléfono: {perfil.telefono ?? "No especificado"}</Text>
          </View>

          {perfil.es_admin && (
            <Pressable
              style={styles.botonAdmin}
              onPress={() => router.push("/admin")}
            >
              <Text style={styles.botonAdminTexto}>Panel de administración</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.botonSecundario}
            onPress={() =>
              router.push({
                pathname: "/perfil/editar",
                params: {
                  nombre: perfil.nombre,
                  ciudad: perfil.ciudad ?? "",
                  telefono: perfil.telefono ?? "",
                  foto_url: perfil.foto_url ?? "",
                },
              })
            }
          >
            <Text style={styles.botonSecundarioTexto}>Editar perfil</Text>
          </Pressable>

          {perfil.rol === "cliente" && (
            <Pressable
              style={styles.botonSecundario}
              onPress={() => router.push("/perfil/hacerme-profesional")}
            >
              <Text style={styles.botonSecundarioTexto}>Quiero ofrecer mis servicios</Text>
            </Pressable>
          )}

          {perfil.rol === "profesional" && (
            <Pressable
              style={styles.botonSecundario}
              onPress={() => router.push("/servicios")}
            >
              <Text style={styles.botonSecundarioTexto}>Mis servicios</Text>
            </Pressable>
          )}

          {perfil.rol === "profesional" && (
            <Pressable
              style={styles.botonSecundario}
              onPress={() => router.push("/disponibilidad")}
            >
              <Text style={styles.botonSecundarioTexto}>Mi horario</Text>
            </Pressable>
          )}

          {perfil.rol === "profesional" && (
            <Pressable
              style={styles.botonSecundario}
              onPress={() => router.push("/perfil/datos-bancarios")}
            >
              <Text style={styles.botonSecundarioTexto}>Datos bancarios</Text>
            </Pressable>
          )}

          {perfil.rol === "profesional" && (
            <Pressable
              style={styles.botonSecundario}
              onPress={() => router.push("/perfil/ganancias")}
            >
              <Text style={styles.botonSecundarioTexto}>Mis ganancias</Text>
            </Pressable>
          )}

          {perfil.rol === "cliente" && (
            <Pressable
              style={styles.botonSecundario}
              onPress={() => router.push("/bookings/historial")}
            >
              <Text style={styles.botonSecundarioTexto}>Historial de servicios</Text>
            </Pressable>
          )}

          {perfil.rol === "profesional" && (
            <Pressable
              style={styles.botonSecundario}
              onPress={() => router.push("/bookings/historial-profesional")}
            >
              <Text style={styles.botonSecundarioTexto}>Historial de servicios</Text>
            </Pressable>
          )}

          <Pressable style={styles.boton} onPress={confirmarCierreSesion}>
            <Text style={styles.botonTexto}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </View>
    </Fondo>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  tarjeta: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  foto: { width: 96, height: 96, borderRadius: 48, marginBottom: 16 },
  fotoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.nettleGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  fotoIniciales: { color: "white", fontSize: 36, fontWeight: "600" },
  nombre: { fontSize: 22, fontWeight: "600", color: colors.quartzite },
  rol: { fontSize: 14, color: colors.coolClay, marginBottom: 20, textTransform: "uppercase" },
  datos: { alignSelf: "stretch", marginBottom: 24 },
  dato: { fontSize: 16, color: colors.quartzite, marginBottom: 8 },
  errorTexto: { color: colors.sugoDellaNonna, backgroundColor: "white", padding: 12, borderRadius: 8 },
  botonSecundario: {
    borderWidth: 1,
    borderColor: colors.nettleGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "stretch",
  },
  botonSecundarioTexto: { color: colors.nettleGreen, fontWeight: "600", textAlign: "center" },
  botonAdmin: {
    backgroundColor: colors.quartzite,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "stretch",
  },
  botonAdminTexto: { color: "white", fontWeight: "600", textAlign: "center" },
  boton: {
    backgroundColor: colors.sugoDellaNonna,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "stretch",
  },
  botonTexto: { color: "white", fontWeight: "600", textAlign: "center" },
});
