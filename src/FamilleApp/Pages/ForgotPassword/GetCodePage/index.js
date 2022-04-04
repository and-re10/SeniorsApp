import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView, Modal, Alert, Linking, AppState, Dimensions, Keyboard } from 'react-native';
import seniorsApi from "../../../../api/app";

const WIDTH = Dimensions.get('window').width;

export default GetCodePage = ({navigation, route}) => {

    const [ code, setCode ] = useState(code);
    const { email } = route.params;
    console.warn(email);
    const verifyCode = async () => {
        const response = await seniorsApi.post('/verify-famille-code', {
            email: email,
            code: code
        });
        if (response.data.message == "ok"){
            // const data = {
            //     // code: response.data.code,
            //     user: response.data.user
            // }
            // console.warn(data);
            navigation.navigate('ResetPasswordPage', {
                // code: code,
                email: email
            })
        } else {
            Alert.alert(response.data.message);
        }
        
        
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: "center", backgroundColor: "#f4f4f4"}}
            keyboardShouldPersistTaps='handled'>

            

            <Text style={{fontSize: WIDTH < 400 ? 17 : 20, width: "70%", fontWeight: "bold", marginBottom: 60, marginTop: WIDTH < 400 ? 100 : 200}}>Veuillez entrer le code que vous avez reçu sur votre boite mail</Text>

            <Text style={{fontSize: WIDTH < 400 ? 15 : 20, width: "70%"}}>
                Code:
            </Text>

            <TextInput 
                autoCapitalize='none' 
                keyboardType='numeric'
                maxLength={6}
                style={{backgroundColor: "lightgrey", height: WIDTH < 400 ? 50 : 55, width: "70%", borderRadius: 15, marginTop: 10, paddingHorizontal: 20, marginBottom: 15, fontSize: WIDTH < 400 ? 17 : 17}} 
                onChangeText={(text) => {
                    setCode(text)
                }} 
                placeholderTextColor="white"
            />

            <TouchableOpacity style={{backgroundColor: "#0d9a15", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "55%", marginVertical:WIDTH < 400 ? 20 : 40}} onPress={() => {verifyCode();}}>
                <Text style={{color: "white", paddingVertical: WIDTH < 400 ? 15 : 18, fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20}}>ENVOYER</Text>
            </TouchableOpacity>

            {/* <TextInput 
                autoCapitalize='none' 
                placeholder="Entrer votre code" 
                style={styled.input} 
                placeholderTextColor="white" 
                // value={`${code}`}
                onChangeText={(text => {
                    setCode(text)
                })} 
            />
            <TouchableOpacity 
                onPress={() => {
                    verifyCode();
                }}
            >
                <Text>Send Code</Text>
            </TouchableOpacity> */}
        </ScrollView>
    )
} 

const styled = StyleSheet.create({
    input: {
        height: 50, 
        paddingHorizontal: 20, 
        borderColor: "lightgrey", 
        backgroundColor: "grey",
        borderWidth: 2, 
        borderRadius: 15, 
        marginVertical: 20,
        width: "70%",
        color: "white"
    }
})