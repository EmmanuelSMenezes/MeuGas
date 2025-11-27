import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Home from "../Home";
import Orders from "../Orders";
import OrderDetails from '../OrderDetails';
 
const Stack = createStackNavigator();

export default function Routes() {
  return (
      <Stack.Navigator
        screenOptions={{
          cardStyle:{
            backgroundColor: '#FFF'
          }
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Orders" component={Orders} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
  )
}