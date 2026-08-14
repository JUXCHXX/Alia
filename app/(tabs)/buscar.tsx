import { View, Text, StyleSheet } from "react-native";

export default function BuscarScreen() {
  return (
    <View style={styles.container}>
      <Text>Buscar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
