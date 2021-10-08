import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
// import Sound from 'react-native-sound';
import { io } from "socket.io-client";
import axios from "axios";

// Notifications Firebase
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default function CallFamillyModal(props) {

    // const [ socket, setSocket ] = useState();

    // useEffect(() => {
    //     const newSocket = io('http://192.168.0.156:3000');   
    //     setSocket(newSocket);
    //     // newSocket.on("hello", msg => {
    //     //     setMessages([...messages, msg])
    //     // });

    //     // socket.on('connection');
    //     // Get senior data
    //     // seniorsApi.get(`/get-senior/${user.senior_id}`).then( response => {
    //     //     // console.warn(response.data)
    //     //     setSenior(response.data);
    //     // });
    // }, []);

    // useEffect(() => {
        // Sound.setCategory('Playback');
        // mySound = new Sound('zak_music.mp3',Sound.MAIN_BUNDLE,(error)=>{
        //     if(error){
        //         console.log('Error loading sound: ' + error);
        //         return;
        //     } else {
        //         mySound.play((success)=>{
        //             if(success){
        //                 console.log('Sound playing')
        //             } else {
        //                 console.log('Issue playing file');
        //             }
        //         })
        //     }
        // });
        // mySound.setVolume(0.9);
        // mySound.release();
    // })

    // stopSound = () => {
    //     mySound.pause()
    // }
 
    const closeModal = (bool) => {
        props.changeModalVisible(bool);
        // props.setData(data);
    };

    const handleVideoCall = () => {
        
        let content = {
            username: props.fam_name,
            to: "famille",
            senior_code: props.senior_code,
            user_img: props.image_senior
        }
        props.socket.emit('videoCall', content);
        // console.warn(user.user_name);
        
    };



    return (
        
        <TouchableOpacity disabled={false} style={{flex: 1, alignItems: "center", justifyContent: "center"}} onPress={() => closeModal(false)}> 
        {/* Modifications sur le touchable Opacity*/}
            <View  style={{flex: 1, height: "100%", width: "100%", backgroundColor: 'rgba(255, 255, 255, .5)', position: "relative", justifyContent: "center", alignItems: "center"}}>
                <View style={{alignItems: "center"}}>
                    {/* <Text style={{marginHorizontal: 5, marginTop: 10, marginBottom: 20, fontWeight: "bold"}}>Appeler {props.role === "senior" ? props.senior_name : props.fam_name}</Text> */}
                    <Image source={{uri: `https://test.tabtab.eu/storage/images/${props.fam_image}`}}
                    style={{height: 400, width: 400, borderRadius: 400}} />
                </View>
                <View style={{width: "70%", flexDirection: "row", justifyContent: "space-around", position: "absolute", bottom: "15%"}}>
                    <TouchableOpacity style={{ width: "100%", paddingVertical: 20, backgroundColor: "green", flexDirection: "row", borderRadius: 10, justifyContent: "center", alignItems: "center", zIndex: 5}} onPress={() => {
                        closeModal(false);
                        // stopSound()
                        handleVideoCall();
                        // console.warn(props.senior_name)

                        messaging().hasPermission().then( async enabled => {
                            console.warn(enabled);
                            // if (enabled) {
                                // console.warn('true')
                                await messaging().registerDeviceForRemoteMessages()
                                messaging().getToken()
                                .then( token => {
                                    console.warn("TOKEN: ", token);
                                    // Alert.alert(token)
                                    // setFBToken(token);
                                })
                                .catch( error => {
                                    console.error(error)
                                }); 
                                
                                messaging().onTokenRefresh( token => {
                                    console.log("Refreshed Token: ", token);
                                });
                
                                // if (role === "senior"){
                                //     var TOPIC = `Senior-${user.user_id}`;
                                // } else {
                                    var TOPIC = `Famille-${props.fam_id}${props.senior_id}`;
                                // }
                                
                                messaging()
                                .subscribeToTopic(TOPIC)
                                .then(() => {
                                    console.warn(`Topic: ${TOPIC} Suscribed`);
                                });
                            // } else {
                            //     // console.warn('false')
                            //     messaging().requestPermission()
                            //     .then( async authStatus => {
                            //         console.warn("APNs Status: ", authStatus);
                            //         // if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
                            //             // await firebase.messaging().registerDeviceForRemoteMessages()
                            //             messaging().getToken()
                            //             .then( token => {
                            //                 console.log("Messaging Token: ", token);
                            //             }).catch( error => {
                            //                 console.log("Error: " , error);
                            //             });
                            //         // }
                            //     })
                            //     .catch ( error => {
                            //         console.error(error);
                            //     });
                            // }
                        })

                        props._checkPermissions(() => {
                            let room = `${props.senior_name}${props.fam_name}ROOM`
                            // console.warn(room)
                            fetch(`https://senior-video-call.herokuapp.com/getToken?userName=${props.senior_name}`)
                            .then((response) => {
                                // console.warn(props.senior_name)
                                if (response.ok) {
                                    // console.warn(props.fam_id)
                                    axios.post('https://senior-video-call.herokuapp.com/remote-message', {
                                            messageTitle: "Call de André",
                                            messageBody: "André vous appelle...",
                                            messageUser: "andre",
                                            firebaseTopic: `Famille-${props.fam_id}${props.senior_id}`,
                                    }).then(response => {
                                        // console.warn("response: " + response);
                                    }).catch(error => {
                                        console.error("error: " + error);
                                    });
                                    response.text().then((jwt) => {
                                        // console.warn(jwt)
                                        props.setCallData({...props.callData, token: jwt});
                                        props.navigation.navigate('Video', {
                                            roomName: room
                                        });
                                        return true;
                                    });
                                } else {
                                    response.text().then((error) => {
                                    Alert.alert(error);
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log('error', error);
                                Alert.alert('API not available');
                            });
                        });
                    }}>
                        <MaterialIcons name="videocam" size={60} color="white"/>
                        <Text style={{color: "white", fontWeight: "bold", fontSize: 40}}> Appeler {props.role === "senior" ? props.senior_name : props.fam_name} ?</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={{marginVertical: 10, backgroundColor: "red", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "40%"}} onPress={() => {
                        handleVideoCall()
                        closeModal(false)
                        // stopSound()
                    }}>
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}}>NON</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
            
        </TouchableOpacity>
    )
}
