import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import { AXIOS } from '../../utils/AxiosInstance'
import { ACCESS_TOKEN_KEY } from '../../utils/StorageKeys'
import { useFormik } from 'formik'
import { initialValues, validationSchema } from '../../components/Shared/ValidationForms/ChangeDisplayNameForm.data'


export function ChangeNameForm(props) {
    
    
    //TODO
    //New endpoint in the backend
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
            <Input placeholder='Nombre completo' rightIcon={{
                type: "material-community",
                name: "account-circle-outline",
                color: "#c2c2c2"
            }}
                onChangeText={(text) => formik.setFieldValue("name", text)}
                errorMessage={formik.errors.name}
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