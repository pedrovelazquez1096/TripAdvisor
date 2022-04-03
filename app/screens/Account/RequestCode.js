import React, {useState, useRef} from "react";
import {StyleSheet, View, Image} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { size, isEmpty } from "lodash";
import { AXIOS, AXIOS_LOGIN } from "../../utils/AxiosInstance";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";

export default function RequestCode(){
    const toastRef = useRef();
    const navigation = useNavigation();
    const [form, setForm] = useState(defaultFormConfirmationValues());
    const [checkCode, setCheckCode] = useState(false)

    const onChange = (e, type) =>{
        setForm({...form, [type]: e.nativeEvent.text});
    }

    const onSubmitRequestNewCode = async () => {
        console.log(form);
        console.log("Requestion new code");
        let response = await AXIOS().post("/signup/newcode?email=" + form.email);
        if(response.data.statusCode === 202){
            setCheckCode(true);
            toastRef.current.show("Un nuevo codigo fue enviado a tu email");
        }
        else{
            console.log(response.data.data.error);
            toastRef.current.show(response.data.data.error);
        }
    }

    const onSubmitConfirmationCode = async () => {
        console.log("cheching new code");
        console.log(form);
        if(isEmpty(form.code)){
            toastRef.current.show("El codigo de confirmacion es obligatorio");
        }else if(size(form.code) < 4 || size(form.code) > 4){
            toastRef.current.show("El codigo es de 4 numeros");
        }else{
            const result = await AXIOS().get('/signup/confirmation?email=' + form.email +'&code=' + form.code);
            console.log("Cuenta confirmada");
            navigation.navigate("account");
        }
    }

    return(
        <KeyboardAwareScrollView>
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