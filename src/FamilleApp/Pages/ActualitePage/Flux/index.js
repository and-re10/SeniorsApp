import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import AuthContext from "../../../../contexts/auth";
import seniorsApi from "../../../../api/app";

export default function Flux(props) {

    // const [ posts, setPosts ] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [ senior, setSenior ] = useState([]);
    const [ famille, setFamille ] = useState([]);
    const [ maisonRepo, setMaisonRepo ] = useState([]);
    const [ posts, setPosts ] = useState([]);
    const { user } = useContext(AuthContext);

    // useEffect(() => {
    //     // get famille data
    //     seniorsApi.get(`/get-famille/${user}`).then(response => {
    //         console.warn(response.data);
    //         setFamille(response.data);
    //     });
    // }, []);

    // useEffect(() => {
    //     // get senior data
    //     seniorsApi.get(`/get-senior/${famille.senior_id}`).then(response => {
    //         console.warn(response.data);
    //         setSenior(response.data);
    //     });
    // }, []);

    const getSenior = async (usr) => {
        try {
            console.warn(usr.senior_id);
            const response = await seniorsApi.get(`get-senior/${usr.senior_id}`)
            console.warn(response.data.maison_repo_id);
            getMaisonRepo(response.data.maison_repo_id);
            getPosts(response.data.maison_repo_id);
        } catch (error) {
            console.warn(error);
        }
    } 

    const getMaisonRepo = async (resp) => {
        try {
            const response = await seniorsApi.get(`get-maison-repo/${resp}`)
            console.warn(response.data);
            setMaisonRepo(response.data);
        } catch (error) {
            console.warn(error)
        }
    }

    const getPosts = async (resp) => {
        try {
            const response = await seniorsApi.get(`get-posts/${resp}`);
            setPosts(response.data);
            console.warn(response.data);
        } catch (error) {
            console.warn(error);
        }
    }

    useEffect(() => {
        // get maison de repo data
        getSenior(user);
        // seniorsApi.get(`get-senior/${user.senior_id}`).then(response => {
        //     console.warn(response.data.maison_repo_id)
        //     getSenior(response)
        //     // seniorsApi.get(`/get-maison-repo/${response.data.maison_repo_id}`).then(response => {
        //     //     console.warn(response.data);
        //     //     setMaisonRepo(response.data);
        //     // });
        //     // console.warn(response.data.maison_repo_id)
        //     // seniorsApi.get(`/get-posts/${response.data.maison_repo_id}`).then(response => {
        //     //     setPosts(response.data);
        //     //     console.warn(response.data);
        //     // })
        // })
        
    }, []);
    // function createPost(nb){
    //     for( let i = 0; i <= nb; i++){
    //         setPosts([...posts, i]);
    //     };
    // };

    // useEffect(() => {
    //     createPost(5);
    // }, [posts]);

    return (
        <View style={{height: "95%", backgroundColor: "#f4f4f4", display: props.display}}>
            <ScrollView style={{flex: 1, marginTop: 10}}>
                {/* <Text style={{alignSelf: "center", fontSize: 50, fontWeight: "bold"}}>Actualité</Text> */}
                {posts?.map((post, index) => {
                    return (
                        <View style={{marginHorizontal: 10, marginVertical: 5, backgroundColor: "white", shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}} key={index}>
                            <View style={{height: 50, flexDirection: "row", marginVertical: 10}}>
                                <View style={{width: "75%", flexDirection: "row", alignItems: "center"}}>
                                    {/* <View style={{marginLeft: 10, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "black"}}> */}
                                    <Image source={{uri: `https://test.tabtab.eu/storage/images/${maisonRepo?.photo_profil}`}}
                                    style={{marginLeft: 10, width: 50, height: 50, borderRadius: 50, borderWidth: 1, borderColor: "black"}} />
                                    {/* <Image height="100" width="100" source={{uri: "https://test.tabtab.eu/storage/images/maison1.jpeg"}}/> */}
                                    {/* </View> */}
                                    <Text style={{marginLeft: 10, fontSize: 20}}>{maisonRepo?.nom}</Text>
                                </View>
                                
                            </View>
                            <Text style={{marginHorizontal: 10}}>{post.description}</Text>

                            <Image source={{uri: `https://test.tabtab.eu/storage/public/images/${post.image}`}}
                            style={{width: "100%", height: 300, marginTop: 20, justifyContent: "center", alignItems: "center"}} />
                            {/* <View style={{width: "100%", height: 300, backgroundColor: "orange", marginTop: 20, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: 50}}>IMG</Text>
                            </View>*/}
                        </View>
                    )
                })}

            </ScrollView>
        </View>
    )
}
