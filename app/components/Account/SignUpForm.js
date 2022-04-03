import React, {useState} from "react";
import { StyleSheet, View, Text} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { validateEmail } from "../../utils/Validations";
import { size, isEmpty, rest } from "lodash";
import { AXIOS, AXIOS_LOGIN } from "../../utils/AxiosInstance";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../utils/StorageKeys";
import { useNavigation } from "@react-navigation/native";

export default function SignUpForm(props){
    const navigation = useNavigation();

    const { toastRef } = props;
    const [showPsw, setShowPsw] = useState(false);
    const [showPswConfirm, setshowPswConfirm] = useState(false);
    const [enableConfirmationFields, setenableConfirmationFields] = useState(false);

    const [formData, setformData] = useState(defaultFormValues());
    const [formDataNewCode, setformDataNewCode] = useState(defutalFormRequestNewCode())
    const [formDataOfficial, setformDataOfficial] = useState(defaultFormOfficialValues());
    const [confirmationForm, setconfirmationForm] = useState(defaultFormConfirmationValues());

    //change this to redirect
    const onSubmit = async () => {
        if(
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.passwordRepeat) ||
            isEmpty(formData.name)){
            toastRef.current.show("Tu Nombre, Correo y contaseña necesarios");
        }
        else if(!validateEmail(formData.email)){
            toastRef.current.show("Email invalido");
        }
        else if(formData.password !== formData.passwordRepeat){
            toastRef.current.show("contraseña deben ser iguales");
        }
        else if(size(formData.password) < 6){
            toastRef.current.show("la contraseña debe ser minimo 6 caracteres");
        }
        else{
            const result = await AXIOS().post('/signup/registration', formDataOfficial);
            //console.log(result.data);
            const statusCode = result.data.statusCode;
            if(statusCode !== 201){
                toastRef.current.show(result.data.data.error);
            }else{  
                toastRef.current.show("Revisa tu email para obterner tu codigo");
                setenableConfirmationFields(true);
            }
        }
        
    }

    const onSubmitConfirmationCode = async () => {
        console.log(confirmationForm);
        if(isEmpty(confirmationForm.code)){
            toastRef.current.show("El codigo de confirmacion es obligatorio");
        }else if(size(confirmationForm.code) < 4 || size(confirmationForm.code) > 4){
            toastRef.current.show("El codigo es de 4 numeros");
        }else{
            const result = await AXIOS().get('/signup/confirmation?email=' + confirmationForm.email +'&code=' + confirmationForm.code);
            if(result.data.statusCode === 202)
            {   
                console.log("cuanta confirmada")
                const result2 = await AXIOS_LOGIN(formDataOfficial.email, formDataOfficial.password);
                if(result2.data.statusCode === 200)
                {
                    console.log("loggeando cuenta");
                    await AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), result2.data.data.access_token);
                    await AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), result2.data.data.refresh_token);
                    console.log("Tokens guardados");
                    //navigation.navigate("account");

                }else{
                    toastRef.current.show(result2.data.messange);
                }
            }else{
                toastRef.current.show(result.data.messange);
            }
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
            <Input
                placeholder="Nombre Completo"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "name")}
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