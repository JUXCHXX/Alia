import { Tabs } from "expo-router/tabs";
import { HouseIcon } from "../../src/components/icons/HouseIcon";
import { SearchIcon } from "../../src/components/icons/SearchIcon";
import { MessageHeartIcon } from "../../src/components/icons/MessageHeartIcon";
import { UserIcon } from "../../src/components/icons/UserIcon";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ color, focused }) => <HouseIcon color={color as string} focused={focused} /> }} />
      <Tabs.Screen name="buscar" options={{ tabBarIcon: ({ color, focused }) => <SearchIcon color={color as string} focused={focused} /> }} />
      <Tabs.Screen name="solicitudes" options={{ tabBarIcon: ({ color, focused }) => <MessageHeartIcon color={color as string} focused={focused} /> }} />
      <Tabs.Screen name="perfil" options={{ tabBarIcon: ({ color, focused }) => <UserIcon color={color as string} focused={focused} /> }} />
    </Tabs>
  );
}
