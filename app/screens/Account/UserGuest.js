import React from "react";
import {StyleSheet, View, ScrollView, Text, Image} from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest(){
    const navigation = useNavigation();

    return(
        <ScrollView centerContent={true} 
                    style={styles.viewBody}
        >
            <Image 
                    source={require("../../../assets/img/user-guest.jpg")}
                    resizeMode="contain"
                    style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil</Text>
            <Text style={styles.description}>
                como describirias tu mejor restauranta... Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit. Cras nec magna consectetur, tristique 
                purus sed, volutpat mauris. Aenean mi ligula, vestibulum eget eros 
                vitae, maximus euismod quam. Vivamus eleifend ipsum quis rutrum tincidunt. 
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    title="Ver perfil" 
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.cntStyle}
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
    },
    image:{
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center",
    },
    description:{
        textAlign: "center",
        marginBottom: 20,
    },
    btnStyle:{
        backgroundColor: "#00a680",
    },
    cntStyle:{
        width: "70%",
    },
    viewBtn: {
        flex: 1,
        alignItems: "center",
    }
});
