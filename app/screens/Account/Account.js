import React, {useState, useEffect} from "react";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import Loading from "../../components/Loading";

   


export default function Accounts(){
    const [login, setLogin] = useState(null);
    useEffect(()=>{
        //desmadre para el auth de firebase
        setLogin(false);
        console.log(login);
    }, []);

    if(login === null) return <Loading isVisible={false} text="cargando"/>;

    return login ? <UserLogged/> : <UserGuest/>;
}