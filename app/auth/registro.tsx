import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../src/services/supabase";
import { colors } from "../../src/constants/colors";
import { Fondo } from "../../src/components/Fondo";

export default function RegistroScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleRegistro() {
    if (!nombre.trim() || !email.trim() || !password) {
      Alert.alert("Faltan datos", "Completa nombre, correo y contraseña.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Contraseña muy corta", "Debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { nombre: nombre.trim() },
      },
    });

    setCargando(false);

    if (error) {
      Alert.alert("Error al registrarte", error.message);
      return;
    }

    Alert.alert(
      "Cuenta creada",
      "Revisa tu correo para confirmar tu cuenta antes de iniciar sesión."
    );
    router.replace("/auth/login");
  }

  return (
    <Fondo source={require("../../assets/images/fondo_login.png")}>
      <View style={styles.container}>
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Crear cuenta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={colors.coolClay}
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />
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

          <Pressable style={styles.boton} onPress={handleRegistro} disabled={cargando}>
            <Text style={styles.botonTexto}>
              {cargando ? "Creando cuenta..." : "Registrarme"}
            </Text>
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
});