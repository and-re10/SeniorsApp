import React, { useCallback, useEffect, useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import Sound from 'react-native-sound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AuthContext from "../contexts/auth";

import { io } from "socket.io-client";

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;



export default function FamilleVideoCallModal(props) {
    const [ roomName, setRoomName ] = useState(`${props.senior_name}${props.fam_name}ROOM`);
    const [ socket, setSocket ] = useState("");
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        // console.warn(props.senior_name);
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
            console.warn("Stop Call Sound");
            mySound.pause();
        }
    })

    useEffect(() => {
        const newSocket = io('https://seniors-app-notification.herokuapp.com/'); // http://192.168.0.156:3000 - https://seniors-app-notification.herokuapp.com/
        setSocket(newSocket);
        console.warn(newSocket)
        newSocket.on("endCall", data => {
            console.warn(data)
            if (data.to === roomName && data.user !== user.user_name){
                // twilioVideo.current.disconnect();
                // setCallData(initialState);
                stopSound();
                // refuseCall();
                closeModal(false);
            }
            
        });

        return () => {
            
            console.warn("End Call")
        }
    }, []);

    stopSound = () => {
        mySound.pause()
    }

    const refuseCall = () => {
        // let roomName = `${props.senior_name}${props.fam_name}ROOM`
        console.warn(socket)
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
        <TouchableOpacity disabled={true} style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
            <View style={{height: "100%", width: "100%", paddingTop: 10, borderRadius: 10, justifyContent: "space-around", alignItems: "center", position: "relative"}}>
                <View style={{}}>
                    {/* <Text style={{marginHorizontal: 5, marginTop: 10, marginBottom: 20, fontWeight: "bold"}}> { props.fam_name} vous appelle</Text> */}
                    
                    {/* <MaterialIcons name="notifications" size={100} color="#ec611d" style={{position: "absolute", top: "-4%", right: "4%", zIndex: 4, transform: [{rotate: "20deg"}]}}/> */}
                    <Image source={{uri: `https://test.tabtab.eu/storage/images/${props.user_image}`}}
                    style={{height: 200, width: 200, borderRadius: 200, marginBottom: 100}} />
                    {/* <View style={{height: 200, width: 200, borderRadius: 200, backgroundColor: "black", marginBottom: 100}} ></View> */}
                    <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>{props.senior_name} vous appelle ...</Text>
                </View>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around"}}>
                    {/* End Call */}
                    <TouchableOpacity style={{backgroundColor: "red", borderRadius: 80, marginRight: 15, justifyContent: "center", alignItems: "center", width: 80, height: 80}} onPress={() => {
                        stopSound();
                        refuseCall();
                        closeModal(false);
                    }}>
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}><MaterialIcons name="call-end" size={38} color="#ffffff"/></Text>
                    </TouchableOpacity>

                    {/* Accept Call */}
                    <TouchableOpacity style={{backgroundColor: "green", borderRadius: 80, justifyContent: "center", alignItems: "center", width: 80, height: 80}} onPress={() => {
                        stopSound()
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
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}>
                            <MaterialIcons name="call" size={38} color="#ffffff"/>
                        </Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
            
        </TouchableOpacity>
    )
}
