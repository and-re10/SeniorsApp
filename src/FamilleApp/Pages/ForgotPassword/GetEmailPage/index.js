import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView, Modal, Alert, Linking, AppState, Dimensions } from 'react-native';
import seniorsApi from "../../../../api/app";
import axios from "axios";

const WIDTH = Dimensions.get('window').width;

export default GetEmaiPage = ({navigation}) => {

    const [ email, setEmail ] = useState("");

    const sendCode = async () => {
        const response = await seniorsApi.post('/verify-famille-email', {
            email: email
        })
        if (response.data.message == "ok"){
            // const data = {
            //     code: response.data.code,
            //     user: response.data.user
            // }
            // console.warn(data);
            // console.warn(response.data.code) // https://senior-video-call.herokuapp.com/ - http://192.168.0.156:5000/
            const resp2 = await axios.post("https://senior-video-call.herokuapp.com/send-email", {
                email: email,
                code: response.data.code
            })

        //     console.warn(resp2.data.response);

            navigation.navigate('GetCodePage', {
                // code: response.data.code,
                email: email
            })
        } else {
            Alert(response.data.message);
        }
        
        
    };

    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "#f4f4f4" }}>
            <Text style={{fontSize: WIDTH < 400 ? 17 : 20, width: "70%", fontWeight: "bold", marginBottom: 60, marginTop: WIDTH < 400 ? 100 : 200}}>Veuillez entrer votre email pour recuperer votre mot de passe</Text>
            <Text style={{fontSize: WIDTH < 400 ? 15 : 20, width: "70%"}}>
                Email:
            </Text>
            <TextInput 
                autoCapitalize='none' 
                autoCorrect={false}
                style={{backgroundColor: "lightgrey", height: WIDTH < 400 ? 50 : 55, width: "70%", borderRadius: 15, marginTop: 10, paddingHorizontal: 20, marginBottom: 15, fontSize: WIDTH < 400 ? 17 : 17}} 
                onChangeText={(text) => {
                    setEmail(text)
                }} 
                placeholderTextColor="white"
            />

            <TouchableOpacity style={{backgroundColor: "#0d9a15", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "55%", marginVertical:WIDTH < 400 ? 20 : 40}} onPress={() => {sendCode();}}>
                <Text style={{color: "white", paddingVertical: WIDTH < 400 ? 15 : 18, fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20}}>ENVOYER</Text>
            </TouchableOpacity>

            {/* <TextInput 
                autoCapitalize='none' 
                placeholder="Entrer votre email" 
                style={styled.input} 
                placeholderTextColor="white" 
                onChangeText={(text => {
                    setEmail(text)
                })} 
            />
            <TouchableOpacity 
                onPress={() => {
                    sendCode();
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