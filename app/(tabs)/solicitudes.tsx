import { View, Text, StyleSheet } from "react-native";

export default function SolicitudesScreen() {
  return (
    <View style={styles.container}>
      <Text>Solicitudes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
