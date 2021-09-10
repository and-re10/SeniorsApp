import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, StatusBar, ScrollView } from 'react-native';
import AuthContext from "../../../contexts/auth";
import { Container, Titre, Logo } from "./styles";
import { useNavigation } from "@react-navigation/native"



export default function SignInFamille({ navigation }) {

    // Sign in
    const { signInFamille } = useContext(AuthContext);
    const [userPassword, setUserPassword] = useState("");
    const [userEmail, setUserEmail] = useState("")

    // const navigation = useNavigation();
    // console.warn(signed);

    function handleSignIn(){
        // console.warn(userPhone, userPassword);
        signInFamille(userEmail, userPassword);
        // console.warn(userCode);
    }
    return (
        <>
            <StatusBar style="dark" backgroung="white" translucent={true} />
            
            {/* Actualization de la page Login Famille */}
            <View style={{height: "100%", backgroundColor: "lightgrey"}}>
                <ScrollView contentContainerStyle={{alignItems: "center"}} style={{flex: 1}}>
                    <Logo>MySeniors.be</Logo>
                    <Titre>
                        Phone Numbre
                    </Titre>
                    <TextInput autoCapitalize='none' placeholder="Enter your email" style={styled.input} onChangeText={(text) => {
                        setUserEmail(text.trim());
                    }} placeholderTextColor="white" />

                    <Titre>
                        Password
                    </Titre>
                    <TextInput autoCapitalize='none' secureTextEntry={true} placeholder="Enter your password" style={styled.input} onChangeText={(text) => {
                        setUserPassword(text.trim());
                    }} placeholderTextColor="white"/>

                    <View style={{justifyContent: "center", alignItems: "center"}}>
                        <Button title="Sing in" style={{fontSize: 28, }} color="grey" onPress={() => {handleSignIn()}}/>
                    </View>
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                        <Button title="Register" style={{fontSize: 28, }} color="grey" onPress={() => { navigation.navigate('RegisterFamille') }}/>
                    </View>
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

