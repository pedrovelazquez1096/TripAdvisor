import React, {useState, useEffect} from "react";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "../../utils/StorageKeys";
import Loading from "../../components/Loading"

import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";


   


export default function Accounts(){
    const [login, setLogin] = useState(null);
    const [ACCESS_TOKEN, setACCESS_TOKEN] = useState("");
    const [REFRESH_TOKEN, setREFRESH_TOKEN] = useState("");

    const getToken = async () =>{
        setACCESS_TOKEN(await AsyncStorageLib.getItem(ACCESS_TOKEN_KEY()));
    }

    useEffect(()=>{
        getToken().then(r => console.log("Access_token:" + ACCESS_TOKEN + "."));

        if(ACCESS_TOKEN !== "null" || ACCESS_TOKEN !== null || ACCESS_TOKEN !== "") {
            setLogin(true);
        }else
            setLogin(false);
    }, []);

    if(login === null) return <Loading isVisible={true} text="cargando"/>;

    return login ? <UserLogged/> : <UserGuest/>;
}