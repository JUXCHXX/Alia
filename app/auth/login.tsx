import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../src/services/supabase";
import { colors } from "../../src/constants/colors";
import { Fondo } from "../../src/components/Fondo";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Faltan datos", "Ingresa tu correo y contraseña.");
      return;
    }

    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setCargando(false);

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        Alert.alert(
          "Correo no confirmado",
          "Revisa tu bandeja de entrada y confirma tu cuenta antes de iniciar sesión."
        );
      } else if (error.message.includes("Invalid login credentials")) {
        Alert.alert("Datos incorrectos", "Correo o contraseña no válidos.");
      } else {
        Alert.alert("Error al iniciar sesión", error.message);
      }
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <Fondo source={require("../../assets/images/fondo_login.png")}>
      <View style={styles.container}>
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Iniciar sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={colors.coolClay}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colors.coolClay}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable style={styles.boton} onPress={handleLogin} disabled={cargando}>
            <Text style={styles.botonTexto}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push("/auth/registro")}>
            <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/auth/recuperar")}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </Pressable>
        </View>
      </View>
    </Fondo>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  tarjeta: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    padding: 24,
  },
  titulo: { fontSize: 24, fontWeight: "600", marginBottom: 24, textAlign: "center", color: colors.quartzite },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.quartzite,
    backgroundColor: "white",
  },
  boton: {
    backgroundColor: colors.lionfishRed,
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
  link: { textAlign: "center", marginTop: 16, color: colors.nettleGreen },
});