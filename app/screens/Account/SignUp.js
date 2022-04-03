import React, {useRef} from "react";
import {StyleSheet, View, Image} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import SignUpForm from "../../components/Account/SignUpForm";


export default function SignUp(){
    const toastRef = useRef();



    return(
        <KeyboardAwareScrollView>
            <Image 
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <SignUpForm toastRef={toastRef}/>
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} fadeOutDuration={1800}/>
        </KeyboardAwareScrollView>
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