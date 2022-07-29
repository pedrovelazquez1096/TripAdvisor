import React, {useState, useRef, useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Shared/Loading/Loading";
import {ACCESS_TOKEN_KEY} from "../../utils/StorageKeys";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { stubArray } from "lodash";
import InfoUser from "../../components/Account/InfoUser";
import { AccountOptions } from "../../components/Account/AccountOptions";
import { AXIOS } from "../../utils/AxiosInstance";

export default function UserLogged(props){
    const toasRef = useRef();
    const [loadingText, setLoadingText] = useState("");
    const [loadingIsVisible, setloadingVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(null)


    const signout = () =>{
        AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(),"").then(
            () => {
                props.set_access_token("");
            }
        )
    }

    useEffect(() => {
      (async () => {
        const access_token = await AsyncStorageLib.getItem(ACCESS_TOKEN_KEY());
        await AXIOS().get('/users/me', {headers:{ 
            Authorization: 'Bearer ' + access_token
        }}).then((result) =>{
            if(result.data.data.me.name !== undefined){
                console.log(result.data.data.me);
                setUserInfo(result.data.data.me);
            }
        }).catch((e) => {
            
        })

      })()
    
    }, [])
    


    return(
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser userInfo={userInfo} />}
            <AccountOptions setUserInfo={setUserInfo}/>
            <Button 
                title="Cerrar Sesión" 
                onPress={() => signout()}
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
            />
            <Toast ref={toasRef} position="center" opacity={0.9}/>
            <Loading text={loadingText} isVisible={loadingIsVisible}/>
        </View>
    );
}


const styles = StyleSheet.create({
    viewUserInfo:{
        minHeight: "100%",
        backgroundColor: "#f2f2f2"
    },
    btnCloseSession:{
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSessionText:{
        color: "#00a680"
    }
})