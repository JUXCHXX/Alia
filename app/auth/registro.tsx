import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../src/services/supabase";
import { colors } from "../../src/constants/colors";

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
    <View style={styles.container}>
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
  link: { textAlign: "center", marginTop: 16, color: colors.nettleGreen },
});