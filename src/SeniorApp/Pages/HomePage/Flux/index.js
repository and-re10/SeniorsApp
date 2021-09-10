import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Button } from 'react-native'

export default function Flux() {

    const [ posts, setPosts ] = useState([]);

    // function createPost(nb){
    //     for( let i = 0; i <= nb; i++){
    //         setPosts([...posts, i]);
    //     };
    // };

    // useEffect(() => {
    //     createPost();
    // }, []);

    return (
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
                })}
                <Button title="Logout" onPress={() => handleSignOut()}/>
            </ScrollView>
        </View>
    )
}
