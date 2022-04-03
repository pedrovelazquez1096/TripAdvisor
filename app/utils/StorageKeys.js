export function ACCESS_TOKEN_KEY(){
    return "ACCESS_TOKEN";
}

export function REFRESH_TOKEN_KEY(){
    return "REFRESH_TOKEN";
}


// AsyncStorageLib.setItem(REFRESH_TOKEN_KEY, refresh_token);

// AXIOS_LOGIN().then(res =>{
//     const access_token = res.data.data.access_token;
//     const refresh_token = res.data.data.refresh_token;
//     console.log(access_token);
//     console.log(refresh_token);
//      AsyncStorageLib.setItem(ACCESS_TOKEN_KEY(), access_token);
    
// }).catch(e =>{
//     console.log(e);
// });

// const access_token = await AsyncStorageLib.getItem(ACCESS_TOKEN_KEY());