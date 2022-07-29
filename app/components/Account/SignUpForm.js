import React, {useState} from "react";
import { StyleSheet, View, Text} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { validateEmail } from "../../utils/Validations";
import { size, isEmpty } from "lodash";
import { AXIOS, AXIOS_LOGIN } from "../../utils/AxiosInstance";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../utils/StorageKeys";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Shared/Loading/Loading";

export default function SignUpForm(props){
    const navigation = useNavigation();

    const { toastRef } = props;
    const [showPsw, setShowPsw] = useState(false);
    const [showPswConfirm, setshowPswConfirm] = useState(false);
    const [enableConfirmationFields, setenableConfirmationFields] = useState(false);
    const [errorName, setErrorName] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPass, setErrorPass] = useState("");
    const [errorRepeatPass, setErrorRepeatPass] = useState("");
    const [errorCode, setErrorCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const [formData, setformData] = useState(defaultFormValues());
    const [formDataNewCode, setformDataNewCode] = useState(defutalFormRequestNewCode())
    const [formDataOfficial, setformDataOfficial] = useState(defaultFormOfficialValues());
    const [confirmationForm, setconfirmationForm] = useState(defaultFormConfirmationValues());


    const onSubmit = async () => {
        if(isEmpty(formData.name)){
            console.log("nombre vacio");
            setErrorName("Tu nombre es necesario");
        }else{
            console.log("nombre no vacio");
            setErrorName("");
        }

        if(isEmpty(formData.email)){
            console.log("email vacio");
            setErrorEmail("Tu email es obligatorio");
        }else{
            console.log("email no vacio");
            setErrorEmail("");
        }

        if(isEmpty(formData.password)){
            console.log("contraseña vacio");
            setErrorPass("Una contraseña es necesaria");
        }else{
            console.log("contraseña no vacio");
            setErrorPass("");
        }

        if(isEmpty(formData.passwordRepeat)){
            console.log("passwordRepeat vacio");
            setErrorRepeatPass("Repite tu constraseña");
        }else{
            console.log("passwordRepeat no vacio");
            setErrorRepeatPass("");
        }

        if(size(formData.email) > 0 &&  !validateEmail(formData.email)){
            console.log("email invalido");
            setErrorEmail("Email no valido");
        }
        else if(formData.password !== formData.passwordRepeat){
            console.log("Pass diferentes");
            setErrorRepeatPass("Las contraseñas deben de ser iguales");
        }
        else if(size(formData.password) < 8){
            console.log("pass corta");
            setErrorPass("la contraseña debe ser minimo 8 caracteres");
        }
        else{
            console.log("haciendo registro");
            setLoadingText("Registrandote");
            setIsLoading(true);
            await AXIOS().post('/signup/registration', formDataOfficial).then((result)=> {
                if(result !== null)
                    setIsLoading(false);
                console.log(result.data);
                const statusCode = result.data.statusCode;
                if(statusCode === 202){
                    toastRef.current.show("Revisa tu email para obterner tu codigo");
                    setenableConfirmationFields(true);
                }else if(statusCode === 409){
                    toastRef.current.show("Ese correo ya está en uso, intenta iniciar sesion");
                }
                else{
                    if(result.data.messange === "invalid email")
                        setErrorEmail("Email no valido");
                    else if(result.data.messange === "invalid password")
                        setErrorPass(result.data.data.error);
                }
                console.log("Registration");
            }).catch(() => {
                setIsLoading(false);
                toastRef.current.show("No te pudimos registrarte, intenta de nuevo");
            });

        }
        
    }

    const onSubmitConfirmationCode = async () => {
        console.log(confirmationForm);
        if(isEmpty(confirmationForm.code)){
            setErrorCode("El codigo de confirmacion es obligatorio");
        }else if(size(confirmationForm.code) < 4 || size(confirmationForm.code) > 4){
            setErrorCode("El codigo es de 4 numeros");
        }else{
            setErrorCode("");
            setLoadingText("Confirmando tu cuenta");
            setIsLoading(true);
            const result = await AXIOS().get('/signup/confirmation?email=' + confirmationForm.email +'&code=' + confirmationForm.code);

            if(result.data.statusCode === 200)
            {   
                console.log("cuanta confirmada");
                setLoadingText("Iniciando Sesion");
                const result2 = await AXIOS_LOGIN(formDataOfficial.email, formDataOfficial.password);
                if(result2.data.statusCode === 200) 
                {
                    console.log("loggeando cuenta");
                    await AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), result2.data.data.access_token);
                    await AsyncStorageLib.setItem(REFRESH_TOKEN_KEY(), result2.data.data.refresh_token);
                    navigation.navigate("account");
                }else{
                    toastRef.current.show(result2.data.messange);
                }
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
            setIsLoading(false);
        }
    }

    const onChange = (e, type) =>{
        setformData({...formData, [type]: e.nativeEvent.text});
        if(type !== "passwordRepeat")
            setformDataOfficial({...formDataOfficial, [type]: e.nativeEvent.text});
        if(type === "email"){
            setconfirmationForm({...confirmationForm,"email": e.nativeEvent.text});
            setformDataNewCode({...formDataNewCode,"email": e.nativeEvent.text});
        }

    }

    const onChangeConfirmation = (e, type) =>{
        setconfirmationForm({...confirmationForm,[type]: e.nativeEvent.text});
    }

    return(
        <View style={styles.formContainer}>
            <Loading isVisible={isLoading} text={loadingText}/>
            <Input
                placeholder="Nombre Completo"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
                rightIcon={
                    <Icon
                         type="material-community"
                         name="card-account-details-outline"
                         iconStyle={styles.iconRight}
                    />
                }
                
            />
            <Input
                placeholder="Correo Electronico"
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
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showPsw}
                onChange={(e) => onChange(e, "password")}
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
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showPswConfirm}
                onChange={(e) => onChange(e, "passwordRepeat")}
                errorMessage={errorRepeatPass}
                rightIcon={
                    <Icon
                         type="material-community"
                         name={showPswConfirm ? "eye-off-outline" : "eye-outline"}
                         iconStyle={styles.iconRight}
                         onPress={() => setshowPswConfirm(!showPswConfirm)}
                    />
                }
            />
            <Input
                disabled={!enableConfirmationFields}
                placeholder={enableConfirmationFields ? "Introduce tu codigo": "Solicita tu codigo"}
                containerStyle={styles.inputForm}
                onChange={(e) => onChangeConfirmation(e, "code")}
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
                title={enableConfirmationFields ? "Unirme" : "Solicitar codigo de confirmacion"}
                containerStyle={styles.btnContainerSignup}
                buttonStyle={styles.btnSignup}
                onPress={enableConfirmationFields ? onSubmitConfirmationCode : onSubmit}
            />
            <Text style={styles.textRegister}>
                ¿No te llego tu codigo? {" "}
                <Text 
                    style={styles.btnRegister}
                    onPress={() => {navigation.navigate("requestcode")}}
                    >
                    Intenta de nuevo
                </Text>
            </Text>
        </View>
    )
}

function defutalFormRequestNewCode(){
    return{
        email: ""
    }
}

function defaultFormConfirmationValues(){
    return{
        code: "",
        email: ""
    }
}

function defaultFormValues(){
    return{
        name:"",
        email: "",
        password: "",
        passwordRepeat: ""
    }
}

function defaultFormOfficialValues(){
    return{
        name: "",
        email: "",
        password: "",
        country: "Mexico",
        language: "Español"
    }
}

const styles = StyleSheet.create({
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