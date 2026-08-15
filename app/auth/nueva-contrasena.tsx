import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from "../../src/services/supabase";
import { colors } from "../../src/constants/colors";

export default function NuevaContrasenaScreen() {
  const url = Linking.useURL();
  const [sesionLista, setSesionLista] = useState(false);
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (url) crearSesionDesdeUrl(url);
  }, [url]);

  async function crearSesionDesdeUrl(url: string) {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
      Alert.alert("Enlace inválido", "El enlace expiró o ya fue usado. Solicita uno nuevo.");
      router.replace("/auth/recuperar");
      return;
    }

    const { access_token, refresh_token } = params;
    if (!access_token || !refresh_token) return;

    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    setSesionLista(true);
  }

  async function handleGuardar() {
    if (password.length < 6) {
      Alert.alert("Contraseña muy corta", "Debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    const { error } = await supabase.auth.updateUser({ password });
    setCargando(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Listo", "Tu contraseña fue actualizada.");
    router.replace("/(tabs)");
  }

  if (!sesionLista) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Verificando enlace...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nueva contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor={colors.coolClay}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.boton} onPress={handleGuardar} disabled={cargando}>
        <Text style={styles.botonTexto}>
          {cargando ? "Guardando..." : "Guardar contraseña"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "600", marginBottom: 24, textAlign: "center", color: colors.quartzite },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.quartzite,
  },
  boton: {
    backgroundColor: colors.lionfishRed,
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});