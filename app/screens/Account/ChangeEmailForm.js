import React, {useState} from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { useFormik } from 'formik'
import { initialValues, validationSchema } from '../../components/Shared/ValidationForms/ChangeDisplayNameForm.data'
export function ChangeEmailForm(props) {
    const { onClose, setUserInfo } = props;
    const [showPsw, setShowPsw] = useState(false);
    
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit: (values) => {
            console.log(values);
            changeName(values)
        }
    });
    
    const changeName = async (values) =>{
        console.log(values)
        AsyncStorageLib.getItem(ACCESS_TOKEN_KEY()).then(access_token =>{
            console.log(access_token)
            AXIOS().put("/user/changename", values, {headers:{
                Authorization: 'Bearer ' + access_token
            }}).then((res) =>{
                console.log(res.data.data.user)
                setUserInfo(res.data.data.user)
            }).catch((e) =>{
                console.log(e)
            }).then(
                onClose()
            )
        })
    }

    return (
        <View style={styles.content}>
            <Input placeholder='Nuevo Email' rightIcon={{
                type: "material-community",
                name: "account-circle-outline",
                color: "#c2c2c2"
            }}
                
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                secureTextEntry={!showPsw}
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
                title="Cambiar" 
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={formik.handleSubmit}
                loading={formik.isSubmitting}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    content:{
        alignItems: "center",
        paddingVertical: 10,
    },
    btnContainer:
    {
        width: "95%",
        marginTop: 10,
    },
    btn: {
        backgroundColor: "#00a680"
    }
})