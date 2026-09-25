import { Stack , Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons"

export default function RootLayout() {
  // return <Stack />;
  return(
    <Tabs screenOptions={{headerShown:false}}>
      <Tabs.Screen
      name="index"
      options={{
        title:"Calculator",
        tabBarIcon:({color,size})=>(
          <Ionicons name="calculator-sharp" size={size} color={color}/>
        )
      }}
      />

      <Tabs.Screen
      name="todo"
      options={{
        title:"ToDo list",
        tabBarIcon:({color,size})=>(
          <Ionicons name="list" size={size} color={color}/>
        )
      }}
      />
    </Tabs>
  )
}
