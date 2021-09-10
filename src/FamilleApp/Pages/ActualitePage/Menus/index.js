import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import AuthContext from "../../../../contexts/auth";
import seniorsApi from "../../../../api/app";

export default function Menus(props) {

    const [ maisonRepo, setMaisonRepo ] = useState([]);
    const [ menus, setMenus ] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        seniorsApi.get(`/get-senior/${user.senior_id}`).then(response => {
            // console.warn(response.data.maison_repo_id)
            seniorsApi.get(`/get-maison-repo/${response.data.maison_repo_id}`).then(response => {
                // console.warn(response.data);
                setMaisonRepo(response.data);
            });
            // console.warn(response.data.maison_repo_id)
            seniorsApi.get(`/get-menus/${response.data.maison_repo_id}`).then(response => {
                setMenus(response.data);
                // console.warn(response.data)
            })
        })
    }, []);

    return (
        <View style={{height: "95%", backgroundColor: "#f4f4f4", display: props.display}}>
            <ScrollView style={{flex: 1, marginTop: 10}}>
                {/* <Text style={{alignSelf: "center", fontSize: 50, fontWeight: "bold"}}>Actualité</Text> */}
                {menus?.map((menu, index) => {
                    return (
                        <View key={index} style={{marginHorizontal: 10, marginVertical: 5, backgroundColor: "white", shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                            <View style={{marginLeft: 20, marginVertical: 20}}>
                                <Text style={{fontSize: 15}}>Menu du {menu.date}</Text>
                                <View style={{marginTop: 20}}>
                                   <Text style={{marginBottom: 10}}>Dejeuner</Text>
                                    <Text style={{fontSize: 20}}>{menu.entree_dejeuner}</Text>
                                    <Text style={{fontSize: 20}}>{menu.plat_dejeuner}</Text>
                                    <Text style={{fontSize: 20}}>{menu.desser_dejeuner}</Text> 
                                </View>
                                
                                <View style={{marginVertical: 20}}>
                                    <Text style={{marginBottom: 10}}>Souper</Text>
                                    <Text style={{fontSize: 20}}>{menu.entree_souper}</Text>
                                    <Text style={{fontSize: 20}}>{menu.plat_souper}</Text>
                                    <Text style={{fontSize: 20}}>{menu.desser_souper}</Text> 
                                </View>
                                
                            </View>
                        </View>

                        // <View style={{marginHorizontal: 10, marginVertical: 5, backgroundColor: "white", shadowColor: "#000",
                        // shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                        //     <View style={{marginLeft: 20, marginVertical: 20}}>
                        //         <Text style={{fontSize: 15}}>Menu du 04/03/2021</Text>
                        //         <View style={{marginTop: 20}}>
                        //            <Text style={{marginBottom: 10}}>Dejeuner</Text>
                        //             <Text style={{fontSize: 20}}>Soupe du jour</Text>
                        //             <Text style={{fontSize: 20}}>Pintadeau rôti aux pois</Text>
                        //             <Text style={{fontSize: 20}}>Crème Anglaise</Text> 
                        //         </View>
                                
                        //         <View style={{marginVertical: 20}}>
                        //             <Text style={{marginBottom: 10}}>Souper</Text>
                        //             <Text style={{fontSize: 20}}>Soupe du jour</Text>
                        //             <Text style={{fontSize: 20}}>Pintadeau rôti aux pois</Text>
                        //             <Text style={{fontSize: 20}}>Crème Anglaise</Text>
                        //         </View>
                                
                        //     </View>
                        // </View>

                        // <View style={{marginHorizontal: 10, marginVertical: 5, backgroundColor: "white", shadowColor: "#000",
                        // shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                        //     <View style={{marginLeft: 20, marginVertical: 20}}>
                        //         <Text style={{fontSize: 15}}>Menu du 05/03/2021</Text>
                        //         <View style={{marginTop: 20}}>
                        //            <Text style={{marginBottom: 10}}>Dejeuner</Text>
                        //             <Text style={{fontSize: 20}}>Soupe du jour</Text>
                        //             <Text style={{fontSize: 20}}>Pintadeau rôti aux pois</Text>
                        //             <Text style={{fontSize: 20}}>Crème Anglaise</Text> 
                        //         </View>
                                
                        //         <View style={{marginVertical: 20}}>
                        //             <Text style={{marginBottom: 10}}>Souper</Text>
                        //             <Text style={{fontSize: 20}}>Soupe du jour</Text>
                        //             <Text style={{fontSize: 20}}>Pintadeau rôti aux pois</Text>
                        //             <Text style={{fontSize: 20}}>Crème Anglaise</Text>
                        //         </View>
                                
                        //     </View>
                        // </View>
                    )
                })}

            </ScrollView>
        </View>
    )
}
