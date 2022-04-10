import React, {useState} from "react";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { StyleSheet, View} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { AXIOS_LOGIN } from "../../utils/AxiosInstance";
import { validateEmail } from "../../utils/Validations";
import { size, isEmpty } from "lodash";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../utils/StorageKeys";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";

export default function SignInForm(){
    const navigation = useNavigation();

    const [showPsw, setShowPsw] = useState(false);
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPass, setErrorPass] = useState("");
    const [signInForm, setSignInForm] = useState(defaultSignInForm());
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const onChange = (e, type) =>{
        setSignInForm({...signInForm, [type]: e.nativeEvent.text});
    }

    const onSumit = async () =>{
        let ready = false;
        if(isEmpty(signInForm.email)){
            setErrorEmail("Tu email es obligatorio");
        }else{
            setErrorEmail("");
            if(!validateEmail(signInForm.email)){
                setErrorEmail("Email no valido");
            }else{
                setErrorEmail("");
            }
        }

        if(isEmpty(signInForm.password)){
            setErrorPass("Falta tu contraseña :(");
        }else{
            setErrorPass("");
            if(size(signInForm.password) < 0){
                setErrorPass("Tu contraseña no es correcta");
            }else{
                setErrorPass("");
                ready = true;
            }
        }

        if(ready){
            setLoadingText("Iniciando Sesión");
            setIsLoading(true);

            await AXIOS_LOGIN(signInForm.email, signInForm.password).then((result)=>{
                setIsLoading(false);

                const statusCode = result.data.statusCode;
                if(statusCode === 200)
                {
                    AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), result.data.data.access_token);
                    AsyncStorageLib.setItem(REFRESH_TOKEN_KEY(), result.data.data.refresh_token);
                    navigation.navigate("account");
                }
            }).catch((error) =>{
                if(error.response.status === 403){
                    setErrorEmail("Email o contraseña incorrecta");
                    setErrorPass("Email o contraseña incorrecta");
                }
                setIsLoading(false);
            })
        }
    }

    return (
        <View style={styles.formContainer}>
            <Loading isVisible={isLoading} text={loadingText}/>
            <Input
                placeholder="Corre Electronico"
                containerStyle={styles.inputForm}
                onChange={(e)=> onChange(e, "email")}
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
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showPsw}
                onChange={(e)=> onChange(e, "password")}
                errorMessage={errorPass}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPsw ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPsw(!showPsw)}
                    />
                }
            />
            <Button
                title="Iniciar Sesión"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnLogin}
                onPress={onSumit}
            />
        </View>
    )
}

function defaultSignInForm(){
    return{
        email: "",
        password: ""
    }
}

const styles = StyleSheet.create({
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
    btnContainer:{
        marginTop: 20,
        width: "95%"
    },
    btnLogin:{
        backgroundColor: "#00a680"
    },
    iconRight:{
        color: "#c1c1c1"
    }
});
