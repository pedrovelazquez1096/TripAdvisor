import React from "react";
import { StyleSheet, View, Text, ActivityIndicator} from "react-native";
import { Input, Icon, Button } from "react-native-elements";

export default function SignUpForm(props){
    return(
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.inputForm}
                
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={true}
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={true}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    formContainer:{
        // flex:1,
        // alignItems:"center",
        // justifyContent: "center",
        marginTop: 30,
    },
    inputForm:{
        width: "100%",
        marginTop: 20,
    },
});