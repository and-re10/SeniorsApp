import React, { useState, createContext, useEffect } from "react";
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import * as auth from "../services/auth";
import { authApi, authSeniorsApi } from "../api/auth";

const initialState = {
    isAudioEnabled: true,
    status: 'disconnected',
    participants: new Map(),
    videoTracks: new Map(),
    userName: '',
    roomName: '',
    token: '',
};

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");
    const [ callData, setCallData ] = useState(initialState);
    // const [userPhone, setUserPhone] = useState("0123456789");
    // const [userPassword, setUserPassword] = useState("$2a$10$RJ9BIwLpFsSGl/h6Ym9mDewz/WhtBqOsRgsQxWIJUBAsRyLqBeaNW");
    // const [userToken, setUserToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNlOTAyYjRhZWIzZjBjMTQ1ZDBlMTEiLCJpYXQiOjE2MTQ3ODYxMDB9.R3bzIqTqIEpZHvIzhuLwDjaEAXjzcJdtwwl77Efl058")

    useEffect(() => {
        async function loadStorageData(){
            const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
            const storagedToken = await AsyncStorage.getItem('@RNAuth:token');
            const storagedRole = await AsyncStorage.getItem('@RNAuth:role');

            // await new Promise(resolve => setTimeout(resolve, 2000))
           
            if (storagedUser && storagedToken && storagedRole){
                authApi.defaults.headers['Authorization'] = `Bearer ${storagedToken}`;
                setUser(JSON.parse(storagedUser));
                setRole(storagedRole);
                // setLoading(false)
            }
        };
        loadStorageData();
    }, []);

    // useEffect(() => {

    // }, []);

    async function signInFamille(email, password) {

        const response = await authSeniorsApi.post('/login-famille', {
            "email": email,
            "password": password
        });

        if (response.data.message){
            alert('Mot de passe incorrecte');
        }

        console.warn(response);
        
        setUser(response.data.famille);
        setRole(response.data.famille.role);

        // authApi.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.data.famille));
        await AsyncStorage.setItem('@RNAuth:token', response.data.token);
        await AsyncStorage.setItem('@RNAuth:role', response.data.famille.role);

    }

    async function signInSenior(code){
        // auth.signIn().then(response => {
        //     setUser(response.user);
        //     console.warn(response.user);
        //     console.warn(user);
        // });
        // console.warn(code)
        const response = await authSeniorsApi.post('/login-senior', {
            "code": code
        });
        // console.warn(response)
        // console.warn(response.data.senior);
        
        setUser(response.data.senior);
        setRole(response.data.senior.role);

        // authSeniorsApi.post('/login-senior', {
        //     "code": code
        // }).then( response => {
        //     console.warn(response.data.senior);
        
        //     setUser(response.data.senior);
        //     setRole(response.data.senior.role);
        // }).catch(error => {
        //     console.error(error);
        // });

        

        // authApi.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.data.senior));
        await AsyncStorage.setItem('@RNAuth:token', response.data.token);
        await AsyncStorage.setItem('@RNAuth:role', response.data.senior.role);
    }

    function signOut(){
        AsyncStorage.clear().then(() => {
            setUser(null);
        });
    }

    // if (loading){
    //     return (
    //         <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
    //             <ActivityIndicator size="large"/>
    //         </View>
    //     );
    // };
    
    return (
        <AuthContext.Provider value={{signed: !!user, user: {user_name: user?.prenom, user_id: user?.id, user_img: user?.photo_profil, senior_id: user?.senior_id, senior_code: user?.code}, signInFamille, signInSenior, signOut, loading, role: role, callData, setCallData}}>
            { children }
        </AuthContext.Provider>
    )
    
}

export default AuthContext;