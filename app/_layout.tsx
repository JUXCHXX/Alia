import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../src/services/supabase";
import { colors } from "../src/constants/colors";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
  supabase.auth.getSession()
    .then(({ data }) => {
      setSession(data.session);
    })
    .catch(() => {
      setSession(null);
    })
    .finally(() => {
      setCargando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (cargando) return;

    const enPantallasDeAuth = segments[0] === "auth";
    const enNuevaContrasena = segments[1] === "nueva-contrasena";

    if (!session && !enPantallasDeAuth) {
      router.replace("/auth/login");
    } else if (session && enPantallasDeAuth && !enNuevaContrasena) {
      router.replace("/(tabs)");
    }
  }, [session, cargando, segments]);

  if (cargando) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.coolClay} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = {
  splash: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.quartzite,
  },
};