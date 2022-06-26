import React, {useState, useRef} from "react";
import {StyleSheet, View, Image} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { size, isEmpty } from "lodash";
import { AXIOS } from "../../utils/AxiosInstance";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../utils/StorageKeys";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmail } from "../../utils/Validations";
import Loading from "../../components/Loading";

import Toast from "react-native-easy-toast";


export default function RequestCode(){
    const toastRef = useRef();
    const navigation = useNavigation();
    const [form, setForm] = useState(defaultFormConfirmationValues());
    const [checkCode, setCheckCode] = useState(false);
    const [errorEmail, setErrorEmail] = useState("");
    const [errorCode, setErrorCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const onChange = (e, type) =>{
        setForm({...form, [type]: e.nativeEvent.text});
    }

    const onSubmitRequestNewCode = async () => {
        console.log(form);
        console.log("Requestion new code");
        setErrorEmail("");

        if(isEmpty(form.email)){
            setErrorEmail("Tu email es obligatorio");
        }else if(!validateEmail(form.email)){
            setErrorEmail("Email no valido");
        }else{
            setIsLoading(true);
            setLoadingText("Obteniendo Codigo");
            let response = await AXIOS().post("/signup/newcode?email=" + form.email);
            if(response !== null)
                setIsLoading(false);
            if(response.data.statusCode === 202){
                setCheckCode(true);
                toastRef.current.show("Un nuevo codigo fue enviado a tu email");
            }
            else{
                console.log(response.data.data.error);
                if(response.data.messange === "Invalid Email")
                    setErrorEmail("Email no valido");
                else if(response.data.messange === "User not found")
                    setErrorEmail("Este email aun no está registrado, intenta registrarte");
                else if(response.data.messange === "Account already unlocked")
                    setErrorEmail("Esta cuanta ya ha sido desbloqueada");
            }
        }
    }

    const onSubmitConfirmationCode = async () => {
        console.log("cheching new code");
        console.log(form);
        setErrorCode("");
        if(isEmpty(form.code)){
            setErrorCode("El codigo de confirmacion es obligatorio");
        }else if(size(form.code) < 4 || size(form.code) > 4){
            setErrorCode("El codigo es de 4 numeros");
        }else{
            setIsLoading(true);
            setLoadingText("Verificando Cuenta");
            let result = await AXIOS().get('/signup/confirmation?email=' + form.email +'&code=' + form.code);
            if(result !== null)
                setIsLoading(false);
            if(result.data.statusCode === 200) {
                console.log("Cuenta confirmada");
                console.log("navigate to Sign In")
                navigation.navigate("account");
                //TODO agregar la lectura de tokens y guardarlos
                //await AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), result2.data.data.access_token);
                //await AsyncStorageLib.setItem(REFRESH_TOKEN_KEY(), result2.data.data.refresh_token);
            }else{
                if(result.data.messange === "invalid email")
                    setErrorEmail("Email no valido");
                else if(result.data.messange === "Confirmation code incorrect")
                    setErrorCode("Codigo de confirmacion incorrecto");
                else if(result.data.messange === "Confirmation code has expired")
                    setErrorCode("El codigo de confirmacion ha expirado");
                else if(result.data.messange === "Account already unlocked")
                    setErrorEmail("Esta cuanta ya ha sido desbloqueada");
                else if(result.data.messange === "User Not Found")
                    setErrorEmail("Este email aun no está registrado, intenta registrarte");
            }
        }
    }

    return(
        <KeyboardAwareScrollView>
            <Loading isVisible={isLoading} text={loadingText}/>
            <Image 
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <View style={styles.formContainer}>
                    <Input
                        placeholder="Email"
                        containerStyle={styles.inputForm}
                        onChange={(e) => onChange(e, "email")}
                        errorMessage={errorEmail}
                        rightIcon={
                            <Icon
                                type="material-community"
                                name="at"
                                iconStyle={styles.iconRight}
                            />
                        }
                        
                    />
                    <Input
                        disabled={!checkCode}
                        placeholder={checkCode ? "Introduce tu codigo": "Solicita tu codigo"}
                        containerStyle={styles.inputForm}
                        onChange={(e) => onChange(e, "code")}
                        errorMessage={errorCode}
                        rightIcon={
                            <Icon
                                type="material-community"
                                name="shield-key-outline"
                                iconStyle={styles.iconRight}
                            />
                        }
                    />
                    <Button
                        title={checkCode ? "Verificar" : "Solicitar codigo de confirmacion"}
                        containerStyle={styles.btnContainerSignup}
                        buttonStyle={styles.btnSignup}
                        onPress={checkCode ? onSubmitConfirmationCode : onSubmitRequestNewCode}
                    />
                </View>
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} fadeOutDuration={1800}/>
        </KeyboardAwareScrollView>
    );
}

function defaultFormConfirmationValues(){
    return{
        code: "",
        email: ""
    }
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
    btnRegister:{
        color: "#00a680",
        fontWeight: "bold",
    },
    textRegister:{
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 50
    },
    formContainer:{
        flex:1,
        alignItems:"center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm:{
        width: "100%",
        marginTop: 20,
    },
    btnContainerSignup:{
        marginTop: 20,
        width: "95%",
    },
    btnSignup:{
        backgroundColor: "#00a680"
    },
    iconRight:{
        color: "#c1c1c1"
    }
});