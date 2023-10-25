import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../components/auth/Login';

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
            name="Login"
            component={Login}
            options={{
                headerShown: false
            }}
        />
    </Stack.Navigator>
  );
};