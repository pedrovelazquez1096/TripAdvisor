import React, {useState} from "react";
import { StyleSheet, View, Text, ActivityIndicator} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validations";
import { size, isEmpty, identity } from "lodash";


export default function SignUpForm(props){
    const { toastRef } = props;
    const [showPsw, setShowPsw] = useState(false);
    const [showPswConfirm, setshowPswConfirm] = useState(false)
    const [formData, setformData] = useState(defaultFormValues())

    const onSubmit = () => {
        if(
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.passwordRepeat)){
            toastRef.current.show("Todos los campos son obligatirios");
        }
        else if(!validateEmail(formData.email)){
            toastRef.current.show("Email invalido");
        }
        else if(formData.password !== formData.passwordRepeat){
            toastRef.current.show("contraseña deben ser iguales");
        }
        else if(size(formData.password) <= 6){
            toastRef.current.show("la contraseña debe ser minimo 6 caracteres");
        }
        else
            console.log(formData);
        //TODO: hacer llamadas con ajax para registrar al usuario
        
    }

    const onChange = (e, type) =>{
        setformData({...formData, [type]: e.nativeEvent.text});
    }

    return(
        <View style={styles.formContainer}>
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
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerSignup}
                buttonStyle={styles.btnSignup}
                onPress={onSubmit}
            />
        </View>
    )
}

function defaultFormValues(){
    return{
        email: "",
        password: "",
        passwordRepeat: ""
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