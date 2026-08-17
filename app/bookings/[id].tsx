import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { supabase } from "../../src/services/supabase";
import { getMensajes, enviarMensaje } from "../../src/services/messages";
import { getEstadoBooking } from "../../src/services/bookings";
import { Message } from "../../src/types/message";
import { colors } from "../../src/constants/colors";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mensajes, setMensajes] = useState<Message[]>([]);
  const [miId, setMiId] = useState<string | null>(null);
  const [estadoBooking, setEstadoBooking] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMiId(data.user?.id ?? null));
  }, []);

  useFocusEffect(
    useCallback(() => {
      getMensajes(id)
        .then(setMensajes)
        .finally(() => setCargando(false));
      getEstadoBooking(id).then(setEstadoBooking);
    }, [id])
  );

  useEffect(() => {
    const canal = supabase
      .channel(`messages-booking-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${id}`,
        },
        (payload) => {
          const nuevoMensaje = payload.new as Message;
          setMensajes((actuales) => [...actuales, nuevoMensaje]);
          setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [id]);

  async function handleRefrescar() {
    setRefrescando(true);
    try {
      const actualizados = await getMensajes(id);
      setMensajes(actualizados);
    } finally {
      setRefrescando(false);
    }
  }

  async function handleEnviar() {
    if (!texto.trim()) return;

    setEnviando(true);
    try {
      await enviarMensaje(id, texto.trim());
      setTexto("");
    } catch (err: any) {
      alert(err.message ?? "No se pudo enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {estadoBooking === "en_progreso" && (
          <View style={[styles.banner, { backgroundColor: colors.nettleGreen }]}>
            <Text style={styles.bannerTexto}>🔧 Servicio en curso</Text>
          </View>
        )}
        {estadoBooking === "completada" && (
          <View style={[styles.banner, { backgroundColor: colors.quartzite }]}>
            <Text style={styles.bannerTexto}>✅ Servicio completado</Text>
          </View>
        )}

        <FlatList
          ref={listRef}
          data={mensajes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={handleRefrescar} />
          }
          ListEmptyComponent={
            <Text style={styles.vacio}>Escribe el primer mensaje.</Text>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.burbuja,
                item.remitente_id === miId ? styles.burbujaPropia : styles.burbujaAjena,
              ]}
            >
              <Text
                style={
                  item.remitente_id === miId ? styles.textoPropio : styles.textoAjeno
                }
              >
                {item.contenido}
              </Text>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.coolClay}
            value={texto}
            onChangeText={setTexto}
            multiline
          />
          <Pressable
            style={styles.botonEnviar}
            onPress={handleEnviar}
            disabled={enviando}
          >
            <Text style={styles.botonEnviarTexto}>Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  vacio: { textAlign: "center", color: colors.coolClay, marginTop: 40 },
  banner: {
    backgroundColor: colors.nettleGreen,
    paddingVertical: 8,
    alignItems: "center",
  },
  bannerTexto: { color: "white", fontWeight: "600", fontSize: 13 },
  burbuja: {
    maxWidth: "75%",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  burbujaPropia: {
    backgroundColor: colors.lionfishRed,
    alignSelf: "flex-end",
  },
  burbujaAjena: {
    backgroundColor: colors.coolClay,
    alignSelf: "flex-start",
  },
  textoPropio: { color: "white" },
  textoAjeno: { color: colors.quartzite },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.coolClay,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.coolClay,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.quartzite,
    maxHeight: 100,
  },
  botonEnviar: {
    backgroundColor: colors.lionfishRed,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  botonEnviarTexto: { color: "white", fontWeight: "600" },
});