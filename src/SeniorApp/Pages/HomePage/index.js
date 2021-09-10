import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import AuthContext from "../../../contexts/auth";
import * as auth from "../../../services/auth";
import { authSeniorsApi } from "../../../api/auth";

export default function HomePage({ navigation }) {

    const [ posts, setPosts ] = useState([]);
    const [ myUser, setMyUser ] = useState({});
    const { signed, loading, user, signOut } = useContext(AuthContext);

    

    // async function fetchSeniorData(){
    //     const response = await authSeniorsApi.get('/senior');
    //     setMyUser(response.data.senior);
    //     // console.warn(response.data.senior.role)
    // }

    // useEffect(() => {
    //     // fetchSeniorData();
    //     showContent(5)
    // }, []);

    function handleSignOut(){
        signOut();
    }

    // function showContent(nb){
    //     for(let i = 0; i < nb; i++){
    //         setPosts([...posts, i]);
    //     }
    // }
    

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" translucent={true}/>
            {/* Créer une Navbar */}
            <View style={{alignItems: "flex-end", justifyContent: "space-between", flexDirection: "row", height: "13%", width: "100%", backgroundColor: "#272b35"}}>
                <TouchableOpacity>
                    <Text style={{color: "white", marginLeft: 20, marginBottom: 20, fontSize: 30, fontWeight: "bold"}}>Navbar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity>
                    <Text style={{color: "white", marginRight: 20, marginBottom: 20, fontSize: 30, fontWeight: "bold"}}> Menu </Text>
                </TouchableOpacity>
                
            </View>
            {/* Créer une navigation Page Actualité */}
            <View style={{flexDirection: "row", justifyContent: "space-between",alignItems: "center" , height: "5%", width: "100%", backgroundColor: "darkgrey"}}>
                <TouchableOpacity>
                    <Text style={{marginLeft: 20, width: 60}}>Flux</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Menus</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{marginRight: 20, width: 60}}>Activités</Text>
                </TouchableOpacity>
                
            </View>
            {/* Créer un flux des acttivités de l'hébergement */}
            
            <View style={{height: "72%", backgroundColor: "lightgrey"}}>
                <ScrollView style={{flex: 1}}>
                    {posts?.map((post, index) => {
                        return (
                            <View style={{margin: 10}} key={index}>
                                <View style={{height: 50, flexDirection: "row", marginVertical: 10}}>
                                    <View style={{width: "75%", flexDirection: "row", alignItems: "center"}}>
                                        <View style={{marginLeft: 10, height: 50, width: 50, backgroundColor: "lightgrey", borderRadius: 50, borderWidth: 1, borderColor: "black"}}></View>
                                        <Text style={{marginLeft: 10, fontSize: 20}}>Les Azalées</Text>
                                    </View>
                                    <View style={{width: "25%", justifyContent: "center", alignItems: "flex-end"}}>
                                        <TouchableOpacity style={{height: 30, width: 30, borderRadius: 50, backgroundColor: "lightgrey", marginRight: 10, borderWidth: 1, borderColor: "orange"}}></TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={{marginHorizontal: 10}}>Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Maecenas nec odio et ante tincidunt tempus. Cras ultricies mi eu turpis hendrerit fringilla. Aenean massa. Donec id justo.</Text>
                                <View style={{width: "100%", height: 300, backgroundColor: "orange", marginTop: 20, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{fontSize: 50}}>IMG</Text>
                                </View>
                            </View>
                        )
                    }) }
                    
                    <Button title="Logout" onPress={() => handleSignOut()}/>
                </ScrollView>
                
            </View>
            <View style={{height: "10%", width: "100%", backgroundColor: "black"}}>
                <Text style={{color: "white"}}>Bottom Navigation</Text>
            </View>
            {/* Créer une navigation Footer */}
            {/* <View style={{height: 100, width: "100%"}}>
                <Text style={{fontSize: 30, fontWeight: "bold", alignSelf: "center", textAlign: "center"}}>Home Page Senior</Text>
            </View>
            <View style={{ height: 150, width: 300, backgroundColor: "green", justifyContent: "space-around" }}>
                <Text style={{backgroundColor: "yellow", textAlign: "center" }}>Nom: { myUser?.nom }</Text>
                <Text style={{backgroundColor: "orange", textAlign: "center" }}>Prenom: { myUser?.prenom }</Text>
                <Text style={{backgroundColor: "lightblue", textAlign: "center" }}>Role: { myUser?.role }</Text>
            </View>
            <Button title="Show Details" onPress={() => navigation.navigate('Details', {
                nom: "Santos",
                prenom: "André",
                age: "24 ans" 
            })}/>*/}
        </View>
    )
}
