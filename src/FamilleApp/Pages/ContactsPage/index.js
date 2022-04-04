import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, Image, Modal, AppState, ScrollView, Dimensions } from 'react-native';
import seniorsApi from "../../../api/app";
import AuthContext from "../../../contexts/auth";
import SeniorAppRoutes from '../../../Routes/seniorApp.routes';
import SimpleModal from "../../../components/SimpleModal";
import VideoCallModal from "../../../components/SeniorVideoCallModal";
import { io } from "socket.io-client";
import {
    checkMultiple,
    request,
    requestMultiple,
    PERMISSIONS,
    RESULTS,
  } from 'react-native-permissions';
import axios from 'axios';

// Icons
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";//plus


// notifications firebase
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
// import firebase from "react-native-firebase"
// import PushNotification from 'react-native-push-notification';

//   import { AppContext } from "../../index";

import notifee from '@notifee/react-native';

const WIDTH = Dimensions.get('window').width;

export default function ContactsPage(props) {

    const [ senior, setSenior ] = useState([]);
    const [ famille, setFamille ] = useState([]);
    const [ myUser, setMyUser ] = useState([]);
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

    // async function onDisplayNotification() {
    //     // Create a channel
    //     const channelId = await notifee.createChannel({
    //       id: 'default',
    //       name: 'Default Channel',
    //     });
    
    //     // Display a notification
    //     await notifee.displayNotification({
    //       title: 'Notification Title',
    //       body: 'Main body content of the notification',
    //       android: {
    //         channelId,
    //         smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //       },
    //     });
    // }

    

    useEffect(() => {
        seniorsApi.get(`/get-famille/${user.user_id}`).then( response => {
            // console.warn(response.data)
            setMyUser(response.data);
        });
        // Get senior data
        seniorsApi.get(`/get-senior/${user.senior_id}`).then( response => {
            // console.warn(response.data)
            setSenior(response.data);
        });

        // const newSocket = io('https://seniors-app-notification.herokuapp.com/');   
        // setSocket(newSocket);
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
       return () => console.warn("Changement de page (contact)")
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
        
        // let content = {
        //     username: user.user_name,
        //     to: "senior",
        //     senior_code: senior.code,
        //     user_img: myUser.photo_profil
        // }
        // socket.emit('videoCall', content);
        // send notification
        // axios.post('https://senior-video-call.herokuapp.com/remote-message').then(response => {
        //     // console.warn("response: " + response);
        // }).catch(error => {
        //     console.error("error: " + error);
        // });
        // console.warn(user.user_name);
        
    };
// {/* senior_id={user.se} */}

    return (
        <View style={{height: "78%", display: props.display, alignItems: "center"}}>
            <ScrollView contentContainerStyle={{ alignItems: "center"}} style={{ flex: 1, marginBottom: 20, width: "100%" }} showsVerticalScrollIndicator={false}>
            <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={() => changeModalVisible(false)}>
                 <SimpleModal changeModalVisible={changeModalVisible}  fam_image={myUser.photo_profil} setData={setData} socket={socket} username={user.user_name} senior_name={senior.prenom} code={senior.code} senior_id={user.senior_id}/> 
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
            <Text style={{fontWeight: "bold", fontSize: 20, marginVertical: 20}}>{senior?.prenom} {senior.nom ? senior.nom.toUpperCase() : senior.nom}</Text>

            {/* Notification */}
            <View style={{width: "60%", alignItems: "center"}}>
                {/* <Button title="Notifee" onPress={() => onDisplayNotification()}/> */}
                <TouchableOpacity style={{backgroundColor: "#3b3b3b", borderRadius: 10, justifyContent: "flex-start", alignItems: "center", width: "100%", marginVertical: 50, flexDirection: "row"}}>
                <FontAwesome5 name="paper-plane" style={{paddingVertical: 15, marginHorizontal: WIDTH < 400 ? 20 : 25}} size={WIDTH < 400 ? 25 : 31} color={"white"} solid/>
                    <Text 
                        style={{color: "white", fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20, textAlign:"center"}} 
                        onPress={() => {
                            changeModalVisible(true);
                            // console.warn(`Senior-${senior.id}`);

                            // messaging().hasPermission().then( async enabled => {
                            //     // console.warn(enabled);
                            //     // if (enabled) {
                            //     //     console.warn('true')
                            //         await messaging().registerDeviceForRemoteMessages()
                            //         messaging().getToken()
                            //         .then( token => {
                            //             // console.warn("TOKEN: ", token);
                            //             // Alert.alert(token)
                            //             // setFBToken(token);
                            //         })
                            //         .catch( error => {
                            //             console.error(error)
                            //         }); 
                                    
                            //         messaging().onTokenRefresh( token => {
                            //             console.log("Refreshed Token: ", token);
                            //         });
                    
                            //         // if (role === "senior"){
                            //         //     var TOPIC = `Senior-${user.user_id}`;
                            //         // } else {
                            //             var TOPIC = `Famille-${senior.id}`;
                            //         // }
                                    
                            //         messaging()
                            //         .subscribeToTopic(TOPIC)
                            //         .then(() => {
                            //             // console.warn(`Topic: ${TOPIC} Suscribed`);
                            //         });
                            //     // } else {
                            //     //     // console.warn('false')
                            //     //     messaging().requestPermission()
                            //     //     .then( async authStatus => {
                            //     //         console.warn("APNs Status: ", authStatus);
                            //     //         // if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
                            //     //             // await firebase.messaging().registerDeviceForRemoteMessages()
                            //     //             messaging().getToken()
                            //     //             .then( token => {
                            //     //                 console.log("Messaging Token: ", token);
                            //     //             }).catch( error => {
                            //     //                 console.log("Error: " , error);
                            //     //             });
                            //     //         // }
                            //     //     })
                            //     //     .catch ( error => {
                            //     //         console.error(error);
                            //     //     });
                            //     // }
                            // })

                            // axios.post('https://senior-video-call.herokuapp.com/remote-message', {
                            //     messageTitle: `Call de ${user.user_name}`,
                            //     messageBody: `${user.user_name}`,
                            //     messageUser: user.user_name,
                            //     role: "senior",
                            //     type: "call",
                            //     senior_code: senior.code.toString(),
                            //     user_img: myUser.photo_profil,
                            //     firebaseTopic: `Senior-${user.senior_id}`,//`Senior-${user.senior_id}`,// Envoyer vers le senior specifique
                            // }).then(response => {
                            //     // console.warn("response: " + response);
                            // }).catch(error => {
                            //     console.error("error: " + error);
                            // });
                        }}
                    >
                        ENVOYER{"\n"}NOTIFICATION
                    </Text>
                </TouchableOpacity>

                {/* Dernière Notification */}
                {/* <Text style={{fontSize: 10, marginBottom: 50, textAlign: "center", fontWeight: "bold", width: "90%"}}>Dernière notification envoyée il y a 10 jours</Text> */}
            </View>
            
            {/* Appeler */}
            <View style={{width: "60%", alignItems: "center"}}>
                <TouchableOpacity style={{backgroundColor: "#0d9a15", borderRadius: 10, justifyContent: "flex-start", alignItems: "center", width: "100%", flexDirection: "row"}} disabled={false}
                        onPress={() => {
                            // handleVideoCall();
                            // props.navigation.navigate('Video');
                            // messaging().hasPermission().then( enabled => {
                            //     // console.warn(enabled);
                            //     if (enabled) {
                            //         // console.warn('true')
                            //         // messaging().registerDeviceForRemoteMessages( remoteMessage => {
                            //         //     console.warn('register')
                            //         // })
                            //         messaging().getToken()
                            //         .then( token => {
                            //             // console.warn("TOKEN: ", token);
                            //             // Alert.alert(token)
                            //             // setFBToken(token);
                            //         })
                            //         .catch( error => {
                            //             console.error(error)
                            //         }); 
                                    
                            //         messaging().onTokenRefresh( token => {
                            //             console.log("Refreshed Token: ", token);
                            //         });
                    
                            //         // if (role === "senior"){
                            //         //     var TOPIC = `Senior-${user.user_id}`;
                            //         // } else {
                            //             var TOPIC = `Famille-${user.user_id}${user.senior_id}`;
                            //         // }
                                    
                            //         messaging()
                            //         .subscribeToTopic(TOPIC)
                            //         .then(() => {
                            //             // console.warn(`Topic: ${TOPIC} Suscribed`);
                            //         });
                            //     } else {
                            //         // console.warn('false')
                            //         messaging().requestPermission()
                            //         .then( async authStatus => {
                            //             // console.warn("APNs Status: ", authStatus);
                            //             // if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
                            //                 // await firebase.messaging().registerDeviceForRemoteMessages()
                            //                 messaging().getToken()
                            //                 .then( token => {
                            //                     console.log("Messaging Token: ", token);
                            //                 }).catch( error => {
                            //                     console.log("Error: " , error);
                            //                 });
                            //             // }
                            //         })
                            //         .catch ( error => {
                            //             console.error(error);
                            //         });
                            //     }
                            // })
                            _checkPermissions(() => {
                                let room = `${senior.prenom}${user.user_name}ROOM`;
                                console.warn(`User Name: ${user.user_name}(${typeof user.user_name}) -> Senior Code: ${senior.code}(${typeof senior.code.toString()}) -> Senior Photo: ${myUser.photo_profil}(${typeof myUser.photo_profil}) -> Senior ID: ${user.senior_id}(${typeof user.senior_id})`)
                                // console.warn(room)
                                // fetch(`https://senior-video-call.herokuapp.com/getToken?userName=${user.user_name}?roomName=${'test'}`)
                                fetch(`https://senior-video-call.herokuapp.com/getToken?userName=${user.user_name}`)
                                .then((response) => {
                                    console.warn(response)
                                    if (response.ok) {
                                        console.warn(`User Name: ${user.user_name}(${typeof user.user_name}) -> Senior Code: ${senior.code.toString()}(${typeof senior.code.toString()}) -> User Photo ${myUser.photo_profil}(${typeof myUser.photo_profil})`)
                                        console.warn(`Senior-${user.senior_id}`)//https://senior-video-call.herokuapp.com - http://192.168.0.156:5000
                                        axios.post('https://senior-video-call.herokuapp.com/remote-message', {
                                            messageTitle: `Call de ${user.user_name}`,
                                            messageBody: `${user.user_name} vous appelle...`,
                                            messageUser: user.user_name,
                                            role: "senior",
                                            type: "call",
                                            senior_code: senior.code.toString(),
                                            user_img: myUser.photo_profil,
                                            firebaseTopic: `Senior-${user.senior_id}`,//`Senior-${user.senior_id}`,// Envoyer vers le senior specifique
                                        }).then(response => {
                                            console.warn("response: " + response.data);
                                        }).catch(error => {
                                            console.error("error: " + error);
                                        });
                    
                                        response.text().then((jwt) => {
                                            // console.warn(jwt)
                                            setCallData({...callData, token: jwt});
                                            props.navigation.navigate('Video', {
                                                roomName: room,
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
                    <FontAwesome5 name="video" style={{paddingVertical: 15, marginHorizontal: WIDTH < 400 ? 25 : 35}} size={WIDTH < 400 ? 25 : 31} color={"white"} solid/>
                    <Text style={{color: "white", fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20}}>APPELER</Text>
                </TouchableOpacity>

                {/* Dernier Appel */}
                {/* <Text style={{fontSize: 10, marginBottom: 50, marginTop: 8, textAlign: "center", fontWeight: "bold", width: "60%"}}>Dernier appel video il y a 5 jours</Text> */}
            </View>
            
            </ScrollView>
        </View>
    )
}
