import React from "react";
import {View, Text, Button} from "react-native";
import {ACCESS_TOKEN_KEY} from "../../utils/StorageKeys";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

export default function UserLogged(){

    const signout = async () =>{
        console.log("borrando token");
        await AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(),"null").catch(error => console.log(error));
    }
    return(
        <View>
            <Text>UserLogged..screen</Text>
            <Button title="Cerrar Sesión" onPress={() => signout()}/>

        </View>
    );
}