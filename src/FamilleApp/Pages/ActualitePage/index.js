import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import AuthContext from "../../../contexts/auth";
import * as auth from "../../../services/auth";
import { authSeniorsApi } from "../../../api/auth";
import requestCameraAndAudioPermission from "../../../services/Permissons";
import { Platform } from 'react-native';

// Components
import Flux from "./Flux/index";
import Menus from "./Menus/index";

export default function ActualitePage({ navigation }, props) {

    // const [ posts, setPosts ] = useState([]);
    const [ myUser, setMyUser ] = useState({});
    const { signed, loading, user, signOut } = useContext(AuthContext);

    // Filter Page
    const [flux, setFlux] = useState("flex");
    const [menus, setMenus] = useState("none");
    const [activites, setActivites] = useState("none");

    // async function fetchSeniorData(){
    //     const response = await authSeniorsApi.get('/senior');
    //     setMyUser(response.data.senior);
    //     // console.warn(response.data.senior.role)
    // }

    function handleSignOut(){
        signOut();
    }

    const filterPage = () => {
        if (flux == "flex"){
          return (
            <Flux display={flux}/>
          )
        } else if (menus == "flex") {
          return (
            <Menus display={menus}/>
          )
        } else if (activites == "flex") {
          return (
            <Activites display={activites}/>
          )
        }
      }
    

    return (
        <View style={{height: "78%", display: props.display}}>
            {/* Créer une navigation Page Actualité */}
            <View style={{flexDirection: "row", justifyContent: "space-around",alignItems: "center" , height: "5%", width: "100%", backgroundColor: "#2e2e2e"}}>
                <TouchableOpacity style={{justifyContent: "center", alignItems: "center", width: "50%", height: "100%", borderBottomWidth: flux === "flex" ? 3 : 0, borderBottomColor: "#f17c21"}} onPress={ () => {
                    setFlux("flex");
                    setMenus("none");
                    }}>
                    <Text style={{color: flux === "flex" ? "#f17c21" : "white", fontSize: 17 }}>Actualité</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{justifyContent: "center", alignItems: "center", width: "50%", height: "100%", borderBottomWidth: menus === "flex" ? 3 : 0, borderBottomColor: "#f17c21"}} onPress={ () => {
                    setFlux("none");
                    setMenus("flex");
                    }}>
                    <Text style={{color: menus === "flex" ? "#f17c21" : "white", fontSize: 17, textAlign: "center" }}>Menus</Text>
                </TouchableOpacity>
                
            </View>

            {/* Créer un flux des activités de l'hébergement */}
            {filterPage()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginTop: 0,
        padding: 20,
        flex: 1,
        backgroundColor: "#ffffff"
    },
    formLabel: {
        paddingBottom: 10,
        paddingTop: 10,
        color: "#0093E9"
    },
    buttonContainer: {
        alignItems: "center",
        paddingTop: 20,
    },
    submitButton: {
        marginTop: 10,
        paddingHorizontal: 60,
        paddingVertical: 10,
        backgroundColor: "#0093E9",
        borderRadius: 25,
        alignSelf: "center"
    },
    formInput: {
        height: 40,
        backgroundColor: "#0093E9",
        color: "#ffffff",
        borderRadius: 4,
        paddingLeft: 20
    }
});
