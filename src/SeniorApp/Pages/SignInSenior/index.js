import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, StatusBar, ScrollView } from 'react-native';
import AuthContext from "../../../contexts/auth";
import { Container, Titre, Logo } from "./styles";
import { useNavigation } from "@react-navigation/native"



export default function SignInSenior() {

    // Sign in
    const { signInSenior } = useContext(AuthContext);
    const [userPassword, setUserPassword] = useState("");
    const [userPhone, setUserPhone] = useState("")
    const [userCode, setUserCode] = useState("");

    const navigation = useNavigation();
    // console.warn(signed);

    function handleSignIn(){
        // console.warn(userPhone, userPassword);
        signInSenior(userCode);
        // console.warn(userCode);
    }
    return (
        // <View style={{flex: 1}}>
        //     <StatusBar style="dark" backgroung="white" translucent={true} />
            
        //     <Text style={{fontSize}}>MySeniors.be</Text>
        //     <Text>Senior Code</Text>
        //     <TextInput secureTextEntry={true} placeholder="Enter your code" style={styled.input} onChangeText={(text) => {
        //         setUserCode(text.trim());
        //     }} placeholderTextColor="white"/>

        //     <View style={{justifyContent: "center", alignItems: "center"}}>
        //         <Button title="Sing in" style={{fontSize: 28, }} color="grey" onPress={() => {handleSignIn()}}/>
        //     </View>
        // </View>

        // Actualization de la page Login Famille
        <>
            <StatusBar style="dark" backgroung="white" translucent={true} />
            <View style={{height: "100%", backgroundColor: "lightgrey"}}>
                <ScrollView contentContainerStyle={{alignItems: "center"}} style={{flex: 1}}>
                <View style={{height: "45%", justifyContent: "center", alignItems: "center"}}>
                    <Logo>MySeniors.be</Logo>
                </View>
                                
                {/* <Titre>
                    Phone Numbre
                </Titre>
                <TextInput placeholder="Enter your phone number" style={styled.input} onChangeText={(text) => {
                    setUserPhone(text.trim());
                }} placeholderTextColor="white" />

                <Titre>
                    Password
                </Titre>
                <TextInput secureTextEntry={true} placeholder="Enter your password" style={styled.input} onChangeText={(text) => {
                    setUserPassword(text.trim());
                }} placeholderTextColor="white"/> */}



                <Titre >
                    Senior Code
                </Titre>
                <TextInput secureTextEntry={true} placeholder="Enter your code" style={styled.input} onChangeText={(text) => {
                    setUserCode(text.trim());
                }} placeholderTextColor="white"/>

                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Button title="Sing in" style={{fontSize: 28, }} color="grey" onPress={() => {handleSignIn()}}/>
                </View>
                {/* <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Button title="Register" style={{fontSize: 28, }} color="grey" onPress={() => { navigation.navigate('Register') }}/>
                </View> */}
                </ScrollView>
            </View>
        </>
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

