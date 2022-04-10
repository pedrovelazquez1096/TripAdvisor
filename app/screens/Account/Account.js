import React, {useState, useEffect} from "react";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {ACCESS_TOKEN_KEY} from "../../utils/StorageKeys";
import Loading from "../../components/Loading"
import {isEmpty} from "lodash";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import {useIsFocused} from "@react-navigation/native";
import {AXIOS} from "../../utils/AxiosInstance";


   


export default function Accounts(){
    const [login, setLogin] = useState(null);
    const [ACCESS_TOKEN, setACCESS_TOKEN] = useState("");
    const [name, setName] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchTokens = () =>{
            if(!login) {
                console.log("use-effect de storage: " + login);
                AsyncStorageLib.getItem(ACCESS_TOKEN_KEY()).then(access_token => {
                    setACCESS_TOKEN(access_token);
                });
            }
        }
        fetchTokens();
    }, [isFocused]);


    useEffect(() => {
        if (isEmpty(ACCESS_TOKEN))
            setLogin(false);
        else {
            setLogin(true);
            AXIOS().get('/users/me', {headers:{
                    Authorization: 'Bearer ' + ACCESS_TOKEN
                }}).then((result) =>{
                if(result.data.data.me.name !== undefined)
                    setName(result.data.data.me.name);
            }).catch((e) => {
                console.log(e);
            })
        }
    }, [ACCESS_TOKEN]);


    if(login === null || login === "null") return <Loading isVisible={true} text="cargando"/>;

    return login ? <UserLogged set_access_token={setACCESS_TOKEN} name={name}/>: <UserGuest/>;
}