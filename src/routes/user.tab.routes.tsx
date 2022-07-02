import React,{useEffect, useState} from "react";
import { Platform } from "react-native";
import { useTheme } from "styled-components/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Orders } from "@screens/Orders";
import { Home } from "@screens/Home";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BottomMenu } from "@components/BottomMenu";
import { useAuth } from "@hooks/auth";
import firestore  from "@react-native-firebase/firestore";

const { Navigator, Screen } = createBottomTabNavigator();

export function UserTabRoutes(){
    const [notifications, setNotifications] = useState('0');
    const {COLORS}=useTheme();
    const {user}=useAuth();
    useEffect(()=>{
      const subscriber = firestore()
      .collection("orders")
      .where('status', '==', 'Pronto')
      .onSnapshot(querySnapshot => {       

        setNotifications(String(querySnapshot.docs.length));
      });

      return () => subscriber();
    },[]);

        return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0
        }
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cardápio" color={color} />
          )
        }}
      />

      <Screen
        name="orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Pedidos" color={color} notifications={notifications} />
          )
        }}
      />
    </Navigator>
  );
}