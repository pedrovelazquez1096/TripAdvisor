import axios from 'axios';
import qs from 'qs'

export function AXIOS(){
    return (axios.create({
        baseURL: 'http://192.168.100.7:8080/api',
        timeout: 10000
      }));
} 

export function AXIOS_LOGIN(usernameP, passwordP){
    return(
        axios({
            method: 'post',
            url: 'http://192.168.100.7:8080/api/signin',
            data: qs.stringify({
                username: usernameP,
                password: passwordP
            }),
            headers:{
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
    );
}