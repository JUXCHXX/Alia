import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { getMiPerfil } from "../../src/services/profiles";
import { colors } from "../../src/constants/colors";
import SolicitudesRecibidasScreen from "../bookings/index";
import MisSolicitudesEnviadasScreen from "../bookings/enviadas";

export default function SolicitudesTab() {
  const [rol, setRol] = useState<"cliente" | "profesional" | null>(null);

  useEffect(() => {
    getMiPerfil().then((perfil) => setRol(perfil?.rol ?? "cliente"));
  }, []);

  if (!rol) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.lionfishRed} />
      </View>
    );
  }

  return rol === "profesional" ? (
    <SolicitudesRecibidasScreen />
  ) : (
    <MisSolicitudesEnviadasScreen />
  );
}