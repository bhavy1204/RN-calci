import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Colors
        tabBarActiveTintColor: "#ff9f0a",
        tabBarInactiveTintColor: "#888",

        // Tab bar
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,

          backgroundColor: "#1c1c1e",

          borderTopWidth: 1,
          borderTopColor: "#333",
        },

        // Labels
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },

        // Icons
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="calculator-sharp"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="todo"
        options={{
          title: "To-Do",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="checkmark-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

