import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, PROFILE_IMG} from "./StorageKeys";
import { AXIOS } from "./AxiosInstance";
import axios from 'axios';

export async function refreshAccessToken(){

    let refreshToken = await AsyncStorageLib.getItem(REFRESH_TOKEN_KEY());
    
    if(refreshToken === null)

    AXIOS().get('/token/refresh', {headers:{
        Authorization: 'Bearer ' + refreshToken
    }}).then((result) => {
        AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), result);
        return result;
    }).catch((e) => {
        return null;
    })
}

export async function getProfileImage(imageURL){
    let access_token = await AsyncStorageLib.getItem(ACCESS_TOKEN_KEY());
    let image = null;
    axios.create({
        baseURL: imageURL,
        timeout: 1000,
        Authorization: 'Bearer ' + access_token
    }).get().then((result) =>{
        AsyncStorageLib.setItem(PROFILE_IMG, result);
        image = result;
    }).catch((e) =>{
        console.log(e);
    }).finally(() =>{
        return image;
    })
}