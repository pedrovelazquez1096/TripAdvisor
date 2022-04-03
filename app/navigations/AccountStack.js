import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account"
import Login from "../screens/Account/Login";
import SignUp from "../screens/Account/SignUp";
import RequestCode from "../screens/Account/RequestCode";
const Stack = createStackNavigator();

export default function AccountStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="account"
                component={Account}
                options={{title: "Mi Cuenta"}}
            />
            <Stack.Screen
                name="login"
                component={Login}
                options={{title: "Iniciar sesion"}}
            />
            <Stack.Screen
                name="signup"
                component={SignUp}
                options={{title: "Registro"}}
            />
            <Stack.Screen
                name="requestcode"
                component={RequestCode}
                options={{title: "Solicita Codigo"}}
            />
        </Stack.Navigator>
    );
}