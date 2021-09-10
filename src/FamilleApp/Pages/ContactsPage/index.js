import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, Image, Modal, AppState, ScrollView } from 'react-native';
import seniorsApi from "../../../api/app";
import AuthContext from "../../../contexts/auth";
import SeniorAppRoutes from '../../../Routes/seniorApp.routes';
import SimpleModal from "../../../components/SimpleModal";
import VideoCallModal from "../../../components/VideoCallModal";
import { io } from "socket.io-client";
import {
    checkMultiple,
    request,
    requestMultiple,
    PERMISSIONS,
    RESULTS,
  } from 'react-native-permissions';
import axios from 'axios';

// import firebase from "react-native-firebase"
// import PushNotification from 'react-native-push-notification';

//   import { AppContext } from "../../index";

export default function ContactsPage(props) {

    const [ senior, setSenior ] = useState([]);
    const [ famille, setFamille ] = useState([]);
    const { user, callData, setCallData, role } = useContext(AuthContext);

    const [ isModalVisible, setIsModalVisible ] = useState(false);
    // const [ isVideoCallModalVisible, setIsVideoCallModalVisible ] = useState(false);
    
    const [ chooseData, setChooseData ] = useState()

    const [ socket, setSocket ] = useState();
    const [ message, setMessage ] = useState("");

    // const messaging = firebase.messaging();

    // messaging.hasPermission()
    // .then( enabled => {
    //     if (enabled) {
    //         messaging.getToken()
    //         .then( token => {
    //             console.log(token);
    //         })
    //         .catch( error => {
    //             console.error(error)
    //         }); 
    //     } else {
    //         messaging.requestPermission()
    //         .then( () => {
    //             console.log("Got permissions");
    //         })
    //         .catch ( error => {
    //             console.error(error);
    //         });
    //     }
    // })
    // .catch( error => {
    //     console.error(error);
    // });

    // firebase.notifications().onNotification( notification => {
    //     const { title, body } = notification;
    //     PushNotification.localNotification({
    //         title: title,
    //         message: body,
    //     });
    // });

    // const [ videoCall, setVideoCall ] = useState("");

    // const { callData, setCallData } = useContext(AppContext);


    const _checkPermissions = (callback) => {
        const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
        const androidPermissions = [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        ];
        checkMultiple(
        Platform.OS === 'ios' ? iosPermissions : androidPermissions,
        ).then((statuses) => {
        const [CAMERA, AUDIO] =
            Platform.OS === 'ios' ? iosPermissions : androidPermissions;
        if (
            statuses[CAMERA] === RESULTS.UNAVAILABLE ||
            statuses[AUDIO] === RESULTS.UNAVAILABLE
        ) {
            Alert.alert(
            'Error',
            'Hardware to support video calls is not available',
            );
        } else if (
            statuses[CAMERA] === RESULTS.BLOCKED ||
            statuses[AUDIO] === RESULTS.BLOCKED
        ) {
            Alert.alert(
            'Error',
            'Permission to access hardware was blocked, please grant manually',
            );
        } else {
            if (
            statuses[CAMERA] === RESULTS.DENIED &&
            statuses[AUDIO] === RESULTS.DENIED
            ) {
            requestMultiple(
                Platform.OS === 'ios' ? iosPermissions : androidPermissions,
            ).then((newStatuses) => {
                if (
                newStatuses[CAMERA] === RESULTS.GRANTED &&
                newStatuses[AUDIO] === RESULTS.GRANTED
                ) {
                callback && callback();
                } else {
                Alert.alert('Error', 'One of the permissions was not granted');
                }
            });
            } else if (
            statuses[CAMERA] === RESULTS.DENIED ||
            statuses[AUDIO] === RESULTS.DENIED
            ) {
            request(statuses[CAMERA] === RESULTS.DENIED ? CAMERA : AUDIO).then(
                (result) => {
                if (result === RESULTS.GRANTED) {
                    callback && callback();
                } else {
                    Alert.alert('Error', 'Permission not granted');
                }
                },
            );
            } else if (
            statuses[CAMERA] === RESULTS.GRANTED ||
            statuses[AUDIO] === RESULTS.GRANTED
            ) {
            callback && callback();
            }
        }
        });
    };

    // useEffect(() => {
    //     _checkPermissions();
    // }, []);

    

    useEffect(() => {
        // Get senior data
        seniorsApi.get(`/get-senior/${user.senior_id}`).then( response => {
            // console.warn(response.data)
            setSenior(response.data);
        });

        const newSocket = io('https://seniors-app-notification.herokuapp.com/');   
        setSocket(newSocket);
        // newSocket.on("hello", msg => {
        //     setMessages([...messages, msg])
        // });
        
        // newSocket.on('videoCall', (data) => {
        //     // console.warn(data)
        //     // console.warn(senior.senior_code)
        //     seniorsApi.get(`/get-senior/${user.senior_id}`).then( response => {
        //         // console.warn(data.senior_code, response.data.code, user.user_name, data.user, data.to)
        //         // setSenior(response.data);
        //         if (data.senior_code === response.data.code && data.user === user.user_name && data.to === 'famille'){
        //             console.warn(data.senior_code, response.data.senior_code, data.user_img)
        //             setVideoCall(data);
        //             // console.warn(msg);
        //             setIsVideoCallModalVisible(true);
        //         }
        //     });
            
        // })

        // socket.on('connection');
       
    }, []);



    // useEffect(() => {
    //     const socket = io(
    //         'http://192.168.0.156/3000'
    //     );
    //     // setSocket(newSocket);

    //     socket.on('connection')

    //     // return () => newSocket.close();
    // }, []);

    const changeModalVisible = (bool) => {
        setIsModalVisible(bool);
    };

    // const changeVideoCallModalVisible = (bool) => {
    //     setIsVideoCallModalVisible(bool);
    // };
    

    const setData = (data) => {
        setChooseData(data)
        setMessage(data);
    };

    const handleVideoCall = () => {
        
        let content = {
            username: user.user_name,
            to: "senior",
            senior_code: senior.code,
            user_img: user.user_img
        }
        socket.emit('videoCall', content);
        // send notification
        // axios.post('https://senior-video-call.herokuapp.com/remote-message').then(response => {
        //     // console.warn("response: " + response);
        // }).catch(error => {
        //     console.error("error: " + error);
        // });
        // console.warn(user.user_name);
        
    };


    return (
        <View style={{height: "78%", display: props.display, alignItems: "center"}}>
            <ScrollView contentContainerStyle={{ alignItems: "center"}} style={{ flex: 1, marginBottom: 20, width: "100%" }} showsVerticalScrollIndicator={false}>
            <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={() => changeModalVisible(false)}>
                <SimpleModal changeModalVisible={changeModalVisible} setData={setData} socket={socket} username={user.user_name} senior_name={senior.prenom} code={senior.code}/>
            </Modal>
            {/* {
                videoCall ? <Modal supportedOrientations={['portrait', 'landscape']} transparent={true} animationType='fade' visible={isVideoCallModalVisible} nRequestClose={() => changeVideoCallModalVisible(false)}>
                    <VideoCallModal role={role}  changeModalVisible={changeVideoCallModalVisible}  fam_name={user.user_name} senior_name={senior.prenom}  image_senior={videoCall?.user_img} _checkPermissions={_checkPermissions} callData={callData} setCallData={setCallData} navigation={props.navigation}/>
                </Modal> : <View></View> 
            } */}
            {/* Image */}
            <Image source={{uri: `https://test.tabtab.eu/storage/images/${senior?.photo_profil}`}}
            style={{height: 170, width: 170, borderRadius: 100, marginTop: 60}} />

            {/* <View style={{height: 170, width: 170, backgroundColor: "grey", borderRadius: 100, marginTop: 60}}></View> */}
            
            {/* Nom du Senior */}
            <Text style={{fontWeight: "bold", fontSize: 20, marginVertical: 20}}>{senior?.prenom} {senior?.nom}</Text>

            {/* Notification */}
            <View style={{width: "60%", alignItems: "center"}}>
                <TouchableOpacity style={{backgroundColor: "#3b3b3b", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}} onPress={() => {
                        changeModalVisible(true);
                        // console.warn(`Senior-${senior.id}`);
                        axios.post('https://senior-video-call.herokuapp.com/remote-message', {
                            messageTitle: "Call de André",
                            messageBody: "André vous appelle...",
                            messageUser: "andre",
                            firebaseTopic: `Senior-${senior.id}`,
                        }).then(response => {
                            // console.warn("response: " + response);
                        }).catch(error => {
                            console.error("error: " + error);
                        });
                        }}>NOTIFICATION</Text>
                </TouchableOpacity>

                {/* Dernière Notification */}
                <Text style={{fontSize: 10, marginBottom: 50, textAlign: "center", fontWeight: "bold", width: "90%"}}>Dernière notification envoyée il y a 10 jours</Text>
            </View>
            
            {/* Appeler */}
            <View style={{width: "70%", alignItems: "center"}}>
                <TouchableOpacity style={{backgroundColor: "#0d9a15", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "100%"}} disabled={false}
                        onPress={() => {
                            handleVideoCall();
                            // props.navigation.navigate('Video');
                            _checkPermissions(() => {
                                let room = `${senior.prenom}${user.user_name}ROOM`;
                                // console.warn(room)
                                // fetch(`https://senior-video-call.herokuapp.com/getToken?userName=${user.user_name}?roomName=${'test'}`)
                                fetch(`https://senior-video-call.herokuapp.com/getToken?userName=${user.user_name}`)
                                .then((response) => {
                                    // console.warn(response)
                                    if (response.ok) {
                                        // console.warn(senior.prenom)
                                        axios.post('https://senior-video-call.herokuapp.com/remote-message', {
                                            messageTitle: "Call de André",
                                            messageBody: "André vous appelle...",
                                            messageUser: "andre",
                                            firebaseTopic: `Senior-${senior.id}`,
                                        }).then(response => {
                                            console.warn("response: " + response);
                                        }).catch(error => {
                                            console.error("error: " + error);
                                        });
                    
                                        response.text().then((jwt) => {
                                            // console.warn(jwt)
                                            setCallData({...callData, token: jwt});
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
                                    // console.log('error', error);
                                    Alert.alert('API not available');
                                });
                            });
                        }}>
                    <Text style={{color: "white", paddingVertical: 18, fontWeight: "bold", fontSize: 20}}>APPELER</Text>
                </TouchableOpacity>

                {/* Dernier Appel */}
                <Text style={{fontSize: 10, marginBottom: 50, marginTop: 8, textAlign: "center", fontWeight: "bold", width: "60%"}}>Dernier appel video il y a 5 jours</Text>
            </View>
            
            </ScrollView>
        </View>
    )
}
