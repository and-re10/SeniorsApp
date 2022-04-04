import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView, Modal, Alert, Linking, AppState, Dimensions } from 'react-native';
import seniorsApi from "../../../../api/app";

const WIDTH = Dimensions.get('window').width;

export default ResetPasswordPage = ({navigation, route}) => {

    const { email } = route.params;
    const [ password, setPassword ] = useState("");
    const [ pass2, setPass2 ] = useState("");

    const resetPassword = async () => {
        if (password === pass2){
            const response = await seniorsApi.post('/reset-famille-password', {
                email: email,
                password: password
            })
            if (response.data.message == "ok"){
                // const data = {
                //     code: response.data.code,
                //     user: response.data.user
                // }
                // console.warn(data);
                navigation.navigate('SignInFamille')
            } else {
                console.warn(response.data.message);
            }
        } else {
            Alert("Passwords differents");
        }
       
        
        
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f4f4" }}>

            <Text style={{fontSize: WIDTH < 400 ? 17 : 20, width: "70%", fontWeight: "bold", marginBottom: 60}}>Veuillez entrer votre nouveau mot de passe</Text>
            {/* <Text style={{fontSize: WIDTH < 400 ? 15 : 20, width: "70%"}}>
                Mot de passe:
            </Text> */}
            <Text style={{fontSize: WIDTH < 400 ? 15 : 20, width: "70%"}}>
                Mot de passe:
            </Text>
            <TextInput 
                autoCapitalize='none' 
                secureTextEntry={true} 
                style={{backgroundColor: "lightgrey", height: WIDTH < 400 ? 50 : 55, width: "70%", borderRadius: 15, marginTop: 10, paddingHorizontal: 20, marginBottom: 15, fontSize: WIDTH < 400 ? 17 : 17}} 
                onChangeText={(text) => {
                    setPassword(text)
                }} 
                placeholderTextColor="white"
            />
            <Text style={{fontSize: WIDTH < 400 ? 15 : 20, width: "70%"}}>
                Confirmation du mot de passe:
            </Text>
            <TextInput 
                autoCapitalize='none' 
                secureTextEntry={true} 
                style={{backgroundColor: "lightgrey", height: WIDTH < 400 ? 50 : 55, width: "70%", borderRadius: 15, marginTop: 10, paddingHorizontal: 20, marginBottom: 15, fontSize: WIDTH < 400 ? 17 : 17}} 
                onChangeText={(text) => {
                    setPass2(text)
                }} 
                placeholderTextColor="white"
            />

            <TouchableOpacity style={{backgroundColor: "#0d9a15", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "55%", marginVertical:WIDTH < 400 ? 20 : 40}} onPress={() => {resetPassword();}}>
                <Text style={{color: "white", paddingVertical: WIDTH < 400 ? 15 : 18, fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20}}>ENVOYER</Text>
            </TouchableOpacity>
            {/* <TextInput 
                autoCapitalize='none' 
                placeholder="Entrer votre password" 
                style={styled.input} 
                secureTextEntry={true} 
                placeholderTextColor="white" 
                onChangeText={(text => {
                    setPassword(text)
                })} 
            />
            <TextInput 
                autoCapitalize='none' 
                placeholder="Reecrire votre password" 
                style={styled.input} 
                secureTextEntry={true} 
                placeholderTextColor="white" 
                onChangeText={(text => {
                    setPass2(text)
                })} 
            />
            <TouchableOpacity 
                onPress={() => {
                    resetPassword();
                }}
            >
                <Text>Send Code</Text>
            </TouchableOpacity> */}
        </View>
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