import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
// import Sound from 'react-native-sound';
import { io } from "socket.io-client";
import axios from "axios";

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;


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
            <View style={{height: 260, width: "90%", paddingTop: 10, backgroundColor: 'white', borderRadius: 10, justifyContent: "space-around"}}>
                <View style={{flex: 1, alignItems: "center", marginBottom: 20}}>
                    <Text style={{marginHorizontal: 5, marginTop: 10, marginBottom: 20, fontWeight: "bold"}}>Appeler {props.role === "senior" ? props.senior_name : props.fam_name}</Text>
                    <Image source={{uri: `https://test.tabtab.eu/storage/images/${props.image_senior}`}}
                    style={{height: 140, width: 140, borderRadius: 100}} />
                </View>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around"}}>
                    <TouchableOpacity style={{marginVertical: 10, backgroundColor: "green", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "40%"}} onPress={() => {
                        closeModal(false);
                        // stopSound()
                        handleVideoCall();
                        // console.warn(props.senior_name)
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
                                            firebaseTopic: `Famille-${props.fam_id}`,
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
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}}>APPELER</Text>
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
