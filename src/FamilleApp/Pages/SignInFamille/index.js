import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AuthContext from "../../../contexts/auth";
import { Container, Titre, Logo } from "./styles";
import { useNavigation } from "@react-navigation/native"

const WIDTH = Dimensions.get('window').width;

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
            <View style={{flex: 1, backgroundColor: "#f4f4f4", alignItems: "center", justifyContent: "space-between"}}>
                {/* <ScrollView contentContainerStyle={{alignItems: "center"}} style={{flex: 1}}> */}
                    {/* <Logo>MySeniors.be</Logo> */}
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <Text style={{marginVertical: WIDTH < 400 ? 25 : 40, fontSize: 20, fontWeight: "bold"}}>J'ai déjà un compte:</Text>

                        {/* <Titre>
                            Email
                        </Titre> */}
                        {/* <Titre>
                            Password
                        </Titre>
                        <TextInput autoCapitalize='none' secureTextEntry={true} placeholder="Enter your password" style={styled.input} onChangeText={(text) => {
                            setUserPassword(text.trim());
                        }} placeholderTextColor="white"/> */}
                        <View style={{width: "70%"}}>
                            <Text style={{fontSize: WIDTH < 400 ? 15 : 20}}>
                                Email:
                            </Text>
                            <TextInput autoCapitalize='none' autoCorrect={false} style={{backgroundColor: "lightgrey", height: WIDTH < 400 ? 40 : 55, width: "100%", borderRadius: 15, marginTop: 10, paddingHorizontal: 20, marginBottom: 15, fontSize: WIDTH < 400 ? 15 : 17}} onChangeText={(text) => {
                                setUserEmail(text.trim());
                            }} placeholderTextColor="white" />

                            <Text style={{fontSize: WIDTH < 400 ? 15 : 20}}>
                                Mot de passe:
                            </Text>
                            <TextInput autoCapitalize='none' secureTextEntry={true} style={{backgroundColor: "lightgrey", height: WIDTH < 400 ? 40 : 55, width: "100%", borderRadius: 15, marginTop: 10, paddingHorizontal: 20, marginBottom: 15, fontSize: WIDTH < 400 ? 15 : 17}} onChangeText={(text) => {
                                setUserPassword(text.trim());
                            }} placeholderTextColor="white"/>
                        </View>

                        <TouchableOpacity style={{backgroundColor: "#0d9a15", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "55%", marginVertical: WIDTH < 400 ? 15 : 25}} onPress={() => {handleSignIn()}}>
                            <Text style={{color: "white", paddingVertical: WIDTH < 400 ? 15 : 18, fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20}}>CONNECTER</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: "center", alignItems: "center", marginTop: 10}} onPress={() => { navigation.navigate('GetEmailPage') }}>
                            <Text style={{fontSize: 17, fontWeight: "bold",}}>
                            Mot de Passe oublié ?
                            </Text>
                        </TouchableOpacity>
                        

                    </View>
                    
                    


                    <View style={{width: "100%", paddingBottom: WIDTH < 400 ? 15 : 60, alignItems: "center"}}>
                        {/* <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Button title="Sing in" style={{fontSize: 28}} color="grey" onPress={() => {handleSignIn()}}/>
                        </View>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Button title="Register" style={{fontSize: 28, }} color="grey" onPress={() => { navigation.navigate('RegisterFamille') }}/>
                        </View> */}
                        {/* <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Button title="Mot de Passe oublié ?" style={{fontSize: 28}} color="grey" onPress={() => { navigation.navigate('GetEmailPage') }}/>
                        </View> */}
                        <Text style={{fontSize: 20, fontWeight: "bold"}}>Pas encore de compte ?</Text>

                        <TouchableOpacity style={{backgroundColor: "black", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "55%", marginVertical: 25}} onPress={() => { navigation.navigate('RegisterFamille') }}>
                            <Text style={{color: "white", paddingVertical: WIDTH < 400 ? 15 : 18, fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20}}>CREER COMPTE</Text>
                        </TouchableOpacity>
                    </View>
                    
                
                {/* </ScrollView> */}
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

