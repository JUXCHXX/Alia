import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../src/services/supabase";
import { colors } from "../../src/constants/colors";

export default function RecuperarScreen() {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleRecuperar() {
    if (!email.trim()) {
      Alert.alert("Falta el correo", "Ingresa tu correo electrónico.");
      return;
    }

    setCargando(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "aliamobile://auth/nueva-contrasena",
    });

    setCargando(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert(
      "Revisa tu correo",
      "Te enviamos un enlace para restablecer tu contraseña."
    );
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Recuperar contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.coolClay}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Pressable style={styles.boton} onPress={handleRecuperar} disabled={cargando}>
        <Text style={styles.botonTexto}>
          {cargando ? "Enviando..." : "Enviar enlace"}
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