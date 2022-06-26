import React, {useState, useRef, useEffect}  from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Avatar } from 'react-native-elements';
import { ACCESS_TOKEN_KEY } from '../../utils/StorageKeys';
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { AxiosImage } from '../../utils/AxiosInstance';
import * as ImagePicker from 'expo-image-picker';
export default function InfoUser(props) {
    const {userInfo} = props;
    const [image, setimage] = useState(null)
    const photoURL = null;
    const [ACCESS_TOKEN, setACCESS_TOKEN] = useState("");

    useEffect(() => {
        const fetchTokens = () =>{
            AsyncStorageLib.getItem(ACCESS_TOKEN_KEY()).then(access_token => {
                setACCESS_TOKEN(access_token);
            });
        }
        fetchTokens();

        
        AxiosImage().get(userInfo.profileImageURL).then((result) =>{
            setimage("data:image/jpeg;base64," + result.data.data.image);
        })
    }, [])
    
    const changeAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3]
        });
        if(!result.cancelled) uploadProfileImage(result.uri);
    }

    const uploadProfileImage = async (uri) =>{
        const response = await fetch(uri);
        const blob = await response.blob();

        console.log();
    }

    return(
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                source={
                    image ? {uri: image} : require("../../../assets/img/avatar-default.jpg")
                }
                containerStyle={styles.userInfoAvatar}
            >
                 <Avatar.Accessory size={23} on onPress={changeAvatar} />
            </Avatar>
            <View>
                <Text style={styles.displayName}>
                    {userInfo.name ? userInfo.name : "Anónimo"}
                </Text>
                <Text>
                    {userInfo.email ? userInfo.email : "Anónimo"}
                </Text>
            </View>
        </View>
    )
}
 
const styles = StyleSheet.create({
    viewUserInfo:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar:{
        marginRight: 20
    },
    displayName:{
        fontWeight: "bold",
        paddingBottom: 5
    }
})