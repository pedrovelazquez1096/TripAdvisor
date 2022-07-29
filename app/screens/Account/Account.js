import React, {useState, useEffect} from "react";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "../../utils/StorageKeys";
import Loading from "../../components/Shared/Loading/Loading";
import {isEmpty} from "lodash";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import {useIsFocused} from "@react-navigation/native";
import {AXIOS} from "../../utils/AxiosInstance";

export default function Accounts(){
    const [login, setLogin] = useState(false);
    const [ACCESS_TOKEN, setACCESS_TOKEN] = useState("");
    const [REFRESH_TOKEN, setREFRESH_TOKEN] = useState("");
    const [failed, setFailed] = useState(false)
    const [name, setName] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchTokens = () =>{
            if(!login) {
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
            AXIOS().get('/users/me', {headers:{
                    Authorization: 'Bearer ' + ACCESS_TOKEN
                }}).then((result) =>{
                if(result.data.data.me.name !== undefined){
                    setName(result.data.data.me.name);
                    setLogin(true);
                    setFailed(false);
                    AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), ACCESS_TOKEN)
                }
            }).catch((e) => {
                setFailed(true);
            })
        }
    }, [ACCESS_TOKEN]);

    useEffect(() => {
        const fetchRefreshTokens = () =>{
            AsyncStorageLib.getItem(REFRESH_TOKEN_KEY()).then(refresh_token => {
                setREFRESH_TOKEN(refresh_token);
            });
        }

        fetchRefreshTokens();

        if(failed){
            AXIOS().get('/token/refresh', {headers:{
                Authorization: 'Bearer ' + REFRESH_TOKEN
            }}).then((result) => {
                setACCESS_TOKEN(result.data.data.access_token);
            }).catch((e) => {

            })
        }
    }, [failed]);


    if(login === null || login === "null") return <Loading isVisible={true} text="cargando"/>;

    return login ? <UserLogged set_access_token={setACCESS_TOKEN} name={name}/>: <UserGuest/>;
}