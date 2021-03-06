import React, { useEffect, useContext, useRef, useState } from 'react'
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
  } from 'react-native';
  import {
    checkMultiple,
    request,
    requestMultiple,
    PERMISSIONS,
    RESULTS,
  } from 'react-native-permissions';

import {
    TwilioVideoLocalView,
    TwilioVideoParticipantView,
    TwilioVideo,
  } from 'react-native-twilio-video-webrtc';

import AuthContext from "../../../../contexts/auth";
import seniorsApi from "../../../../api/app";

import { io } from "socket.io-client";

// Icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"

const initialState = {
    isAudioEnabled: true,
    status: 'disconnected',
    participants: new Map(),
    videoTracks: new Map(),
    userName: '',
    roomName: '',
    token: '',
  };

export default function VideoPage({navigation, route}) {
    const twilioVideo = useRef(null);
    const [ senior, setSenior ] = useState({});
    const { user, role, callData, setCallData } = useContext(AuthContext);
    const { roomName } = route.params
    const [ flipCamera, setFlipCamera ] = useState(true);
    const [ socket, setSocket ] = useState()

    // useEffect(() => {
    //     if (role !== "senior"){
    //         seniorsApi.get(`/get-senior/${user.senior_id}`).then( response => {
    //             // console.warn(response.data)
    //             setSenior(response.data);
    //         });
    //     } else {

    //     };
        
        
    // }, [])
    
    useEffect(() => {
        // console.warn(roomName)
        twilioVideo.current.connect({
            roomName: roomName ,
            accessToken: callData.token,
        });
        
        
        // console.warn(callData.token)
        setCallData({...callData, status: 'connecting'});
        return () => {
        //   _onEndButtonPress();
            twilioVideo.current.disconnect();
            setCallData(initialState);
        };
    }, []);

    useEffect(() => {
        const newSocket = io('https://seniors-app-notification.herokuapp.com/'); // http://192.168.0.156:3000 - https://seniors-app-notification.herokuapp.com/
        setSocket(newSocket);
        newSocket.on("endCall", data => {
            console.warn(data)
            if (data.to === roomName && data.user !== user.user_name){
                // if(Array.from(callData.videoTracks).length !== 0) {
                    twilioVideo.current.disconnect();
                    setCallData(initialState);
                // }
                
            }
            
        });
        return () => {
            console.warn("End Call")
        }
    }, []);

    const _onEndButtonPress = () => {
        twilioVideo.current.disconnect();
        setCallData(initialState);

        let content = {
            to: roomName,
            user: user.user_name
        }
        // if(Array.from(callData.videoTracks).length !== 0) {
            socket.emit('endCall', content);
        // }
        
        
        
    };

    const _onMuteButtonPress = () => {
    twilioVideo.current
        .setLocalAudioEnabled(!callData.isAudioEnabled)
        .then((isEnabled) => setCallData({...callData, isAudioEnabled: isEnabled}));
    };

    const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera();
    setFlipCamera(!flipCamera);
    };

    const localViewScreen = () => {
        if (Array.from(callData.videoTracks).length <= 1) {
            console.warn(Array.from(callData.videoTracks).length)
            return (
                // <TwilioVideoLocalView 
                // enabled={true} 
                // style={{width: "100%", height: "100%"}} />
                <TwilioVideoLocalView 
                    enabled={true} 
                    style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}} 
                    // style={{width: "100%", height: "100%"}}
                    />
            )   
        } else {
            console.warn(Array.from(callData.videoTracks).length);
            return (
                <TwilioVideoLocalView 
                    enabled={true} 
                    style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}} />
                // <TwilioVideoLocalView enabled={true} 
                    // style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 5, borderRadius: 10, position: "absolute", bottom: 0}} />
                // <TwilioVideoLocalView 
                // enabled={true} 
                // style={{width: "100%", height: "50%"}} />
            )
        }
    }

    const checkRole = () => {
        console.warn(role);
        if ( role === "famille"){
            return (
                <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around", height: 100, alignItems:        "center", position: "absolute", bottom: 0}}>
                    <TouchableOpacity style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: "lightgrey", alignItems: "center", justifyContent: "center"}} onPress={_onMuteButtonPress}>
                        {/* <Text>
                            {callData.isAudioEnabled ? 'Mute' : 'Unmute'}
                        </Text> */}
                        {callData.isAudioEnabled ? <FontAwesome name="microphone" size={30}/> : <FontAwesome name="microphone-slash" size={30}/>}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: "red", alignItems: "center", justifyContent: "center"}} onPress={_onEndButtonPress}>
                        {/* <Text>End</Text> */}
                        <MaterialIcons name="call-end" size={30}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: "grey", alignItems: "center", justifyContent: "center"}} onPress={_onFlipButtonPress}>
                        {/* <Text>Flip</Text> */}
                        {flipCamera ? <MaterialIcons name="camera-front" size={30}/> : <MaterialIcons name="camera-rear" size={30}/> }
                        {/* <MaterialIcons name="camera-front" size={30}/> */}
                        {/* camera-rear */}
                    </TouchableOpacity>
                </View>
            )
        } else if (role === "senior") {
            return (
                <View style={{width: "100%", flexDirection: "row", justifyContent: "center", height: 100, alignItems: "center", position: "absolute", bottom: 10}}>
                
                    <TouchableOpacity style={{ backgroundColor: "red", borderRadius: 10, marginRight: 15, justifyContent: "center", alignItems: "center", width: "40%", height: 100}} onPress={_onEndButtonPress}>
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}>Raccrocher</Text>
                        {/* <MaterialIcons name="call-end" size={30}/> */}
                    </TouchableOpacity>
                    
                </View>
            )
        }
        
    }

    return (
        <View style={{flex: 1}}>
            <TwilioVideo
                ref={twilioVideo}
                onRoomDidConnect={() => {
                    // console.warn("Connected")
                    setCallData({...callData, status: 'connected'});
                }}
                onRoomDidDisconnect={() => {
                    // console.warn("Disconnected")
                    setCallData({...callData, status: 'disconnected'});
                    navigation.goBack();
                }}
                onRoomDidFailToConnect={(error) => {
                    Alert.alert('Error Test', error.error);
                    setCallData({...callData, status: 'disconnected'});
                    // console.warn("Fail To Connect")
                    navigation.goBack();
                }}
                onParticipantAddedVideoTrack={({participant, track}) => {
                    // console.warn("Participant Added Video Track")
                    if (track.enabled) {
                        setCallData({
                          ...callData,
                          videoTracks: new Map([
                            ...callData.videoTracks,
                            [
                              track.trackSid,
                              {
                                participantSid: participant.sid,
                                videoTrackSid: track.trackSid,
                              },
                            ],
                          ]),
                        });
                    }
                }}
                onParticipantRemovedVideoTrack={({track}) => {
                    // console.warn('Participant Removed Video Track')
                    const videoTracks = callData.videoTracks;
                    videoTracks.delete(track.trackSid);
                    setCallData({...callData, videoTracks});
                }}
            />

            {(callData.status === 'connected' || callData.status === 'connecting') && (
                <View style={{flex: 1}}>
                {callData.status === 'connected' && (
                    <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap"}}>
                        {Array.from(callData.videoTracks, ([trackSid, trackIdentifier]) => {
                            // console.warn(Array.from(callData.videoTracks).length)
                            // if (Array.from(callData.videoTracks).length <= 1) {
                            //     console.warn(Array.from(callData.videoTracks).length)
                            //     return (
                            //         <TwilioVideoLocalView 
                            //             enabled={true} 
                            //             //style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}} 
                            //             style={{width: "100%", height: "100%"}}
                            //             />
                            //     )   
                            // } else {
                            //     console.warn(Array.from(callData.videoTracks).length);
                            //     return (
                            //         <View style={{flex: 1, position: "relative"}}>
                            //             <TwilioVideoParticipantView
                            //                 style={{width: "100%", height: "100%"}}
                            //                 key={trackSid}
                            //                 trackIdentifier={trackIdentifier}
                            //             />
                            //             <TwilioVideoLocalView 
                            //                 enabled={true} 
                            //                 style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}} 
                            //             />
                            //         </View>
                            //         // <TwilioVideoLocalView enabled={true} 
                            //             // style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 5, borderRadius: 10, position: "absolute", bottom: 0}} />
                            //         // <TwilioVideoLocalView 
                            //         // enabled={true} 
                            //         // style={{width: "100%", height: "50%"}} />
                            //     )
                            // }

                            // return (
                            //     <TwilioVideoParticipantView
                            //     style={{width: "100%", height: "100%"}}
                            //     key={trackSid}
                            //     trackIdentifier={trackIdentifier}
                            //     />
                            // )

                            // localViewScreen() 

                            // if (Array.from(callData.videoTracks).length === 0) {
                            //     return (
                            //         <TwilioVideoLocalView
                            //         enabled={true}
                            //         style={{width: "100%", height: "100%", zIndex: 1}}
                            //         />)
                            // } else {
                                return (
                                    <TwilioVideoParticipantView
                                        style={{width: "100%", height: "100%"}}
                                        key={trackSid}
                                        trackIdentifier={trackIdentifier}
                                    />
                                )
                            // }


                            // Array.from(callData.videoTracks).length <= 1 ?
                            // (<TwilioVideoParticipantView
                            // style={{width: "100%", height: "50%"}}
                            // key={trackSid}
                            // trackIdentifier={trackIdentifier}
                            // />) : Array.from(callData.videoTracks).length <= 2 ? (<TwilioVideoParticipantView
                            // style={{width: "100%", height: "50%"}}
                            // key={trackSid}
                            // trackIdentifier={trackIdentifier}
                            // />) : (<TwilioVideoParticipantView
                            // style={{width: "100%", height: "50%"}}
                            // key={trackSid}
                            // trackIdentifier={trackIdentifier}
                            // />)
                        })}
                        
                        {/* { localViewScreen() } */}
                        
                    </View>
                )}
                    {/* <View style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}}></View> */}
                    {/* <TwilioVideoLocalView 
                    enabled={true} 
                    style={{width: "22%", height: "20%"}} /> */}
                    {/* <TwilioVideoLocalView 
                    enabled={true} 
                    style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}} /> */}
                    {/* { localViewScreen() } */}
                    {
                        Array.from(callData.videoTracks).length === 0 ? (
                                <TwilioVideoLocalView
                                    enabled={true}
                                    style={{width: "100%", height: "100%", zIndex: 1}}
                                />
                            ) : (
                                <TwilioVideoLocalView 
                                    enabled={true} 
                                    style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}} 
                                />
                            )
                    }
                    {/* Array.from(callData.videoTracks).length === 0) {
                                return (
                                    
                            } else {

                            }
                    }) */}

                    {/* <TwilioVideoLocalView 
                        enabled={true} 
                        //style={{bottom: "0%", width: "35%", left: "64%", height: "30%", zIndex: 2, borderRadius: 10, position: "absolute", bottom: 0}} 
                        style={{width: "100%", height: "100%"}}
                    /> */}
                </View>
            )}
            {checkRole()}
            
            
        </View>
        
      )
    // return (
    //     <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
    //         <Text>Video Call Screen</Text>
    //         <TouchableOpacity style={{paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "grey", marginTop: 20, borderRadius: 10}} onPress={() => navigation.navigate("Home")}>
    //             <Text style={{color: "white"}}>Home Screen</Text>
    //         </TouchableOpacity>
    //     </View>
    // )
}

// import React from 'react'
// import { View, Text } from 'react-native'

// export default function VideoPage(navigation) {
//     return (
//         <View>
//             <Text>Video Page</Text>
//         </View>
//     )
// }
