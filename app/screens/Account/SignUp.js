import React from "react";
import {StyleSheet, View, ScrollView, Text, Image} from "react-native";
import SignUpForm from "../../components/Account/SignUpForm";

export default function SignUp(){
    return(
        <View>
            <Image source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <SignUpForm/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logo:{
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewForm:{
        marginRight: 40,
        marginLeft: 40,
    },
});