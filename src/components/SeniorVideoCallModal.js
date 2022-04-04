import React, { useCallback, useEffect, useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import Sound from 'react-native-sound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AuthContext from "../contexts/auth";

import { io } from "socket.io-client";

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;


export default function SeniorVideoCallModal(props) {

    const [ roomName, setRoomName ] = useState(`${props.senior_name}${props.fam_name}ROOM`);
    const [ socket, setSocket ] = useState("");
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        // console.warn(props.fam_image)
        Sound.setCategory('Playback');
        mySound = new Sound('TELEPHONE-ROTARY_GEN-HDF-23047.wav',Sound.MAIN_BUNDLE,(error)=>{
            if(error){
                console.log('Error loading sound: ' + error);
                return;
            } else {
                mySound.play((success)=>{
                    if(success){
                        // console.log('Sound playing')
                    } else {
                        console.log('Issue playing file');
                    }
                })
            }
        });
        mySound.setVolume(0.9);
        mySound.release();

        return () => {
            console.log("Stop Call Sound")
            mySound.pause()
        }
    })

    useEffect(() => {
        const newSocket = io('https://seniors-app-notification.herokuapp.com/');// http://192.168.0.156:3000 - https://seniors-app-notification.herokuapp.com/
        setSocket(newSocket);
        console.warn("test Raccrocher avec socket")
        console.warn(`New Socket: ${newSocket}`);
        newSocket.on("endCall", data => {
            // console.warn(data.user + " - " + user.user_name);
            console.log(data);
            console.warn(data.to === roomName && data.user !== user.user_name);
            if (data.to === roomName && data.user !== user.user_name){
                stopSound();
                // refuseCall();
                closeModal(false)
                // props.changeModalVisible(false);
            }
            
        });

        return () => {
            
            console.warn("End Call");
        }
    }, []);

    stopSound = () => {
        mySound.pause()
    }

    const refuseCall = () => {
        // let roomName = `${props.senior_name}${props.fam_name}ROOM`
        let content = {
            to: roomName,
            user: user.user_name
        }

        socket.emit('endCall', content);
    }
 
    const closeModal = (bool) => {
        props.changeModalVisible(bool);
        // props.setData(data);
    };



    return (
        <TouchableOpacity disabled={true} style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(255, 255, 255, .5)'}}>
            <View style={{height: "100%", width: "100%", paddingTop: 10, borderRadius: 10, justifyContent: "center", alignItems: "center", position: "relative"}}>
                <View style={{alignItems: "center", position: "relative"}}>
                    {/* <Text style={{marginHorizontal: 5, marginTop: 10, marginBottom: 20, fontWeight: "bold"}}> { props.fam_name} vous appelle</Text> */}
                    
                    <MaterialIcons name="notifications" size={100} color="#ec611d" style={{position: "absolute", top: "-4%", right: "4%", zIndex: 4, transform: [{rotate: "20deg"}]}}/>
                    <Image source={{uri: `https://test.tabtab.eu/storage/images/${props.fam_image}`}}
                    style={{height: 400, width: 400, borderRadius: 400}} />
                    {/* <View style={{height: 400, width: 400, borderRadius: 400, backgroundColor: "black"}} ></View> */}
                </View>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "center", position: "absolute", bottom: "15%"}}>
                    <TouchableOpacity style={{backgroundColor: "red", borderRadius: 10, marginRight: 15, justifyContent: "center", alignItems: "center", width: "40%", height: 100}} onPress={() => {
                        stopSound();
                        refuseCall();
                        closeModal(false)
                    }}>
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}>Raccrocher</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: "green", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "40%", height: 100}} onPress={() => {
                        stopSound();
                        // refuseCall();
                        closeModal(false);
                        // console.warn(props.senior_name)
                        props._checkPermissions(() => {
                            let room = `${props.senior_name}${props.fam_name}ROOM`
                            // console.warn(room)
                            fetch(`https://senior-video-call.herokuapp.com/getToken?userName=${props.role === "senior" ? props.senior_name : props.fam_name}`)
                            .then((response) => {
                                // console.warn(props.senior_name)
                                if (response.ok) {
                                    // console.warn(response)
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
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}>Décrocher</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
            
        </TouchableOpacity>
    )
}
