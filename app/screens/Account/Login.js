import React from "react";
import {StyleSheet, View, ScrollView, Text, Image} from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import SignInForm from "../../components/Account/SignInForm";

export default function Login(){

    return(
        <ScrollView>
            <Image 
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <SignInForm/>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.viewContainer}>
                <ForgotPassword/>
            </View>
        </ScrollView>
    );
}

function ForgotPassword(){
    //const navigation = useNavigation();
    return(
        <Text style={styles.textRegister}>
            ¿Olvidaste tu contraseña? {" "}
            <Text
                style={styles.btnRegister}
                onPress={() => {
                    console.log("olvido passs")
                    //navigation.navigate("signup")
                }}
            >
                Recuperala aqui
            </Text>
        </Text>
    );
}

function CreateAccount(){
    const navigation = useNavigation();
    return(
        <Text style={styles.textRegister}>
            ¿Aún no tienes cuenta? {" "}
            <Text 
                style={styles.btnRegister}
                onPress={() => {
                    console.log("registro")
                    navigation.navigate("signup")
                }}
                >
                Registrate!
            </Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    logo:{
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewContainer:{
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister:{
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister:{
        color: "#00a680",
        fontWeight: "bold",
    },
    divider:{
        backgroundColor: "#00a680",
        margin: 40,
    }
});