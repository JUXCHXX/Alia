import { View, Text, StyleSheet } from "react-native";
import { Fondo } from "../../src/components/Fondo";

export default function InicioScreen() {
  return (
    <Fondo source={require("../../assets/images/fondo_app.png")}>
      <View style={styles.container}>
        <Text style={styles.texto}>Inicio</Text>
      </View>
    </Fondo>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  texto: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    backgroundColor: "rgba(31,43,37,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});