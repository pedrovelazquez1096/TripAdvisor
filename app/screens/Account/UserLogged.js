import React from "react";
import {View, Text, Button} from "react-native";
import {ACCESS_TOKEN_KEY} from "../../utils/StorageKeys";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

export default function UserLogged(props){
    const signout = () =>{
        AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(),"").then(
            () => {
                props.set_access_token("");
            }
        )
    }


    return(
        <View>
            <Text>Bienvenido {props.name}</Text>
            <Button title="Cerrar Sesión" onPress={() => signout()}/>
        </View>
    );
}
