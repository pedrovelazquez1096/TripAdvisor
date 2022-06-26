import axios from 'axios';
import qs from 'qs'

export const baseURL_domain = "http://192.168.100.7:8080/api"

export function AXIOS(){
    return (axios.create({
        baseURL: baseURL_domain,
        timeout: 10000
      }));
} 


export function AxiosImage(url){
    return (axios.create({
        baseURL: [baseURL_domain,'/images/profile/',url].join(''),
        timeout: 1000
    }));
}

export function AXIOS_LOGIN(usernameP, passwordP){
    return(
        axios({
            method: 'post',
            url: baseURL_domain + '/signin',
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