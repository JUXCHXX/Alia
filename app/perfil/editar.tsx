import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { actualizarMiPerfil } from "../../src/services/profiles";
import { subirFotoPerfil } from "../../src/services/storage";
import { colors } from "../../src/constants/colors";

export default function EditarPerfilScreen() {
  const params = useLocalSearchParams<{
    nombre?: string;
    ciudad?: string;
    telefono?: string;
    foto_url?: string;
  }>();

  const [nombre, setNombre] = useState(params.nombre ?? "");
  const [ciudad, setCiudad] = useState(params.ciudad ?? "");
  const [telefono, setTelefono] = useState(params.telefono ?? "");
  const [fotoLocal, setFotoLocal] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function elegirFoto() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tus fotos para cambiar tu foto de perfil.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!resultado.canceled) {
      setFotoLocal(resultado.assets[0].uri);
    }
  }

  async function handleGuardar() {
    if (!nombre.trim()) {
      Alert.alert("Falta el nombre", "El nombre no puede estar vacío.");
      return;
    }

    setGuardando(true);
    try {
      let fotoUrl: string | undefined;
      if (fotoLocal) {
        fotoUrl = await subirFotoPerfil(fotoLocal);
      }

      await actualizarMiPerfil({
        nombre: nombre.trim(),
        ciudad: ciudad.trim(),
        telefono: telefono.trim(),
        ...(fotoUrl ? { foto_url: fotoUrl } : {}),
      });

      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar perfil</Text>

      <Pressable onPress={elegirFoto} style={styles.fotoContainer}>
        {fotoLocal || params.foto_url ? (
          <Image source={{ uri: fotoLocal ?? params.foto_url }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Text style={styles.fotoTexto}>Agregar foto</Text>
          </View>
        )}
        <Text style={styles.cambiarFotoTexto}>Toca para cambiar la foto</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor={colors.coolClay}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        placeholderTextColor={colors.coolClay}
        value={ciudad}
        onChangeText={setCiudad}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor={colors.coolClay}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Pressable style={styles.boton} onPress={handleGuardar} disabled={guardando}>
        <Text style={styles.botonTexto}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center", color: colors.quartzite },
  fotoContainer: { alignItems: "center", marginBottom: 20 },
  foto: { width: 96, height: 96, borderRadius: 48 },
  fotoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.coolClay,
    alignItems: "center",
    justifyContent: "center",
  },
  fotoTexto: { color: "white", fontSize: 12, textAlign: "center", paddingHorizontal: 8 },
  cambiarFotoTexto: { color: colors.nettleGreen, fontSize: 13, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.quartzite,
  },
  boton: { backgroundColor: colors.lionfishRed, padding: 14, borderRadius: 8, marginTop: 8 },
  botonTexto: { color: "white", textAlign: "center", fontWeight: "600" },
});