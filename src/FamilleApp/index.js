import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView, Modal, Alert, Linking, AppState, Dimensions } from 'react-native';
import AuthContext from "../contexts/auth";
import * as auth from "../services/auth";
import { authSeniorsApi } from "../api/auth";
import requestCameraAndAudioPermission from "../services/Permissons";
import { Platform } from 'react-native';
import seniorsApi from "../api/app";

import FamilleVideoCallModal from "../components/FamilleVideoCallModal";
import { io } from "socket.io-client";
import {
    checkMultiple,
    request,
    requestMultiple,
    PERMISSIONS,
    RESULTS,
  } from 'react-native-permissions';

// Components
import Flux from "./Pages/ActualitePage/Flux/index";
import Menus from "./Pages/ActualitePage/Menus/index";

// Import Page
import ActualitePage from "./Pages/ActualitePage/index";
import ContactsPage from "./Pages/ContactsPage/index";
import MonComptePage from "./Pages/MonComptePage/index";

// Firebase Push Notifications
// import firebase from "react-native-firebase";
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// Notification Sounds
import NotificationSounds, { playSampleSound } from  'react-native-notification-sounds';
import Sound from 'react-native-sound';

// Icons
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

// Dimensions Device
const WIDTH = Dimensions.get('window').width;

export default function FamillePage({ navigation }) {

    // const [ posts, setPosts ] = useState([]);
    const [ myUser, setMyUser ] = useState({});
    const [ senior, setSenior ] = useState([]);
    const { signed, loading, user, signOut, callData, setCallData, role } = useContext(AuthContext);

    // Filter Actialité Page
    const [flux, setFlux] = useState("flex");
    const [menus, setMenus] = useState("none");

    // Filter Famille Page
    const [actualite, setActualite] = useState("flex");
    const [contacts, setContacts] = useState('none');
    const [monCompte, setMonCompte] = useState('none');

    // Video Call
    const [ videoCall, setVideoCall ] = useState("");
    const [ isVideoCallModalVisible, setIsVideoCallModalVisible ] = useState(false);
    const [ socket, setSocket ] = useState();

    // Firebase Messaging Token
    const [ FBToken, setFBToken ] = useState("");

    // async function fetchSeniorData(){
    //     const response = await authSeniorsApi.get('/senior');
    //     setMyUser(response.data.senior);
    //     // console.warn(response.data.senior.role)
    // }

    function handleSignOut(){
        signOut();
    }

    const filterPage = () => {
        if (actualite == "flex"){
            return (
                <ActualitePage display={actualite}/>
            )
        } else if (contacts == "flex") {
            return (
                <ContactsPage display={contacts} navigation={navigation}/>
            )
        } else if (monCompte == "flex"){
            return (
                <MonComptePage display={monCompte} FBToken={FBToken}/>
            )
        }
    }

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

    var testNotif = null;
    // const messaging = firebase.messaging();

    const [ stopNotif, setStopNotif ] = useState(false);
    const [ timerNotif, setTimerNotif ] = useState(15);

    useEffect(() => {
        // console.warn(WIDTH)
        // console.warn('test')
        messaging().requestPermission();
        messaging().hasPermission().then( async  enabled => {
            // console.warn(enabled);
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

                testNotif = messaging().onMessage( async remoteMessage => {
                    // if (AppState.currentState === "active") {
                        console.warn('A new message arrived!', remoteMessage.data);
                        // Push notification IOS
                        // PushNotificationIOS.presentLocalNotification({
                        //     alertTitle: remoteMessage.data.title,
                        //     alertBody: remoteMessage.data.body,
                        //     isSilent: true,
                        //     // soundName: "zak_music.mp3",
                        // });
                        // console.warn('onMessage');
                        // Linking.openURL("seniorsApp://")
                        // End Push Notification IOS
                        // Linking.openURL("seniorsApp://app")
                        // stopSound
                    // }
                })

                

                // messaging().setBackgroundMessageHandler(async remoteMessage => {
                //     // Linking.openURL("seniorsApp://")
                //     console.log("setBackgroundMessageHandler(")
                // });

                messaging().onNotificationOpenedApp(remoteMessage => {
                    setStopNotif(true);
                    console.warn(stopNotif);
                    // PushNotificationIOS.presentLocalNotification({
                    //         alertTitle: remoteMessage.data.title,
                    //         alertBody: remoteMessage.data.body,
                    //         isSilent: true,
                    //         // soundName: "zak_music.mp3",
                    //     });
                    // // Linking.openURL("seniorsApp://");
                    // console.log("onNotificationOpenedApp");
                });

                messaging().getInitialNotification( remoteMessage => {
                    // notificationTimer(remoteMessage);
                    // setStopNotif(true);
                    // console.warn(stopNotif);
                    PushNotificationIOS.presentLocalNotification({
                        alertTitle: remoteMessage.data.title,
                        alertBody: remoteMessage.data.body,
                        isSilent: true,
                        // soundName: "zak_music.mp3",
                    });
                    // Linking.openURL("seniorsApp://");
                    // console.log("getInitialNotification");
                });
                // console.warn(role);

                // if (role === "senior"){
                //     var TOPIC = `Senior-${user.user_id}`;
                // } else {
                    var TOPIC = `Famille-${user.user_id}${user.senior_id}`;
                // }
                
                messaging()
                .subscribeToTopic(TOPIC)
                .then(() => {
                    console.warn(`Topic: ${TOPIC} Suscribed`);
                    // Famille
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
    }, []);

    const notificationTimer = (remoteM) => {
        // let compt = 0;
        // let tempoNotif = setInteval( () => {

        //     PushNotificationIOS.presentLocalNotification({
        //         alertTitle: remoteM.data.title,
        //         alertBody: remoteM.data.body,
        //         // isSilent: false,
        //         soundName: "zak_music.mp3",
        //         repeats: true,
        //         // reply_placeholder_text: "Write your response...", // (required)
        //         // reply_button_text: "Reply" // (required)
        //     });
        //     if ( compt === 4 ){
        //         clearInterval(tempoNotif);
        //     };

        // }, 500 );


        // setInterval( () => {
        //     setTimerNotif(timerNotif - 1);

        //     PushNotificationIOS.presentLocalNotification({
        //         alertTitle: remoteM.data.title,
        //         alertBody: remoteM.data.body,
        //         // isSilent: false,
        //         soundName: "zak_music.mp3",
        //         reply_placeholder_text: "Write your response...", // (required)
        //         reply_button_text: "Reply" // (required)
        //     });

        // }, 2000);

        // if (timerNotif === 0 || stopNotif === true) {
        //     clearInterval()
        // }

    }

    // End Push Notidfication
    // useEffect(() => {
    
    //     PushNotificationIOS.addEventListener("register", onRegistered);
    //     PushNotificationIOS.addEventListener("registrationError", onRegistrationError);
    //     PushNotificationIOS.addEventListener("localNotification", onLocalNotification);
    //     PushNotificationIOS.addEventListener("notification", onRemoteNotification);
    
    //     PushNotificationIOS.requestPermissions();
    
    //     return () => {
    //       PushNotificationIOS.removeEventListener("register", onRegistered);
    //       PushNotificationIOS.removeEventListener("registrationError", pnRegistrationError);
    //       PushNotificationIOS.removeEventListener("localNotification", onLocalNotification);
    //       PushNotificationIOS.removeEventListener("notification", onRemoteNotification);
    //     }
    //   }, []);
    
    //   // Button
    //   const scheduleLocalNotification = () => {
    //     PushNotificationIOS.scheduleLocalNotification({
    //       alertBody: " Schedule Notification ",
    //       alertDate: new Date(new Date().valueOf() + 1000).toISOString(),
    //     });
    //   };
    //   // Button
    //   const sendProfilNotification = () => {
    //     PushNotificationIOS.presentLocalNotification({
    //       alertTitle: "Deep link to profil",
    //       alertBody: "demo://app/profile/1000",
    //       applicationIconBadgeNumber: 1,
    //     });
    //   };
    //   // Button
    //   const sendSettingsNotificationWithSound = () => {
    //     PushNotificationIOS.addNotificationRequest({
    //       id: "notificationWithSound",
    //       title: "Notification Deep Link",
    //       subtitle: "Recive Deep Link",
    //       body: "demo://app/notifications",
    //       sound: "",
    //       badge: 1,
    //     });
    //   };
    //   // Button
    //   const addNotificationRequest = () => {
    //     PushNotificationIOS.addNotificationRequest({
    //       id: "test",
    //       title: "deep link",
    //       subtitle: "Open notifications",
    //       body: "demo://app/notifications",
    //       category: "test",
    //       threadId: "thread-id",
    //       fireDate: new Date(new Date().valueOf() + 2000),
    //       repeats: true,
    //     });
    //   };
    
    //   const onRegistered = (deviceToken) => {
    //     console.warn("Registered For Remote Push", `Device Token: ${deviceToken}`);
    //   };
    
    //   const onRegistrationError = (error) => {
    //     console.warn(`Error (${error.code}):${error.message}`);
    //   };
    
    //   const onRemoteNotification = (notification) => {
    //     const isClicked = notification.getData().userInteraction === 1;
    //   };
    
    //   const onLocalNotification = (notification) => {
    //     const isClicked = notification.getData().userInteraction === 1;
    //   };
    
    //   // Deep Linking 
    //   const openApp = () => {
    //     Linking.openURL("seniorsApp://")
    //   }

    // End Push Notidfication

    // var testNotif = null;
    // const messaging = firebase.messaging();
    

    

    // firebase.notifications().onNotification( notification => {
    //     const { title, body } = notification;
    //     Alert.alert(
    //         title,
    //         body
    //     );
    // });

    // messaging.hasPermission()
    // .then( enabled => {
    //     if (enabled) {
    //         messaging.getToken()
    //         .then( token => {
    //             console.log("TOKEN: ", token);
    //             // Alert.alert(token)
    //         })
    //         .catch( error => {
    //             console.error(error)
    //         }); 
            
    //         messaging.onTokenRefresh( token => {
    //             console.log("Refreshed Token: ", token);
    //         });

    //         testNotif = messaging.onMessage( async remoteMessage => {
    //             console.log('A new message arrived!', remoteMessage.data);
    //             Alert.alert(
    //                 remoteMessage.data.title,
    //                 remoteMessage.data.body
    //             );
    //         })
            

    //         // firebase.notifications().onNotification( notification => {
    //         //     // const { title, body } = notification;
    //         //     // Alert.alert(
    //         //     //     title,
    //         //     //     body
    //         //     // );
    //         //     console.log(notification);
    //         // });
            
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
        // const { title, body } = notification;
        // Alert.alert(
        //     title,
        //     body
        // );
        // console.log(notification);
    // });
    
    // var messaging = firebase.messaging();
    // messaging().setBackgroundMessageHandler( async remoteMessage => {
    //     console.log('Message is handled in the background!', remoteMessage);
    // });

    // async function registerAppWithFCM() {
    //     await messaging().registerDeviceForRemoteMessages();
    // }
    // stopSound = () => {
    //     mySound.pause()
    // }
    
    // useEffect(() => {
    //     _checkPermissions();
    //     // registerAppWithFCM()
    //     // messaging().setAutoInitEnabled(true)
    //     // messaging().registerDeviceForRemoteMessages(true)
    //     messaging.hasPermission().then( enabled => {
    //         if (enabled) {
    //             messaging.getToken()
    //             .then( token => {
    //                 console.log("TOKEN: ", token);
    //                 // Alert.alert(token)
    //                 setFBToken(token);
    //             })
    //             .catch( error => {
    //                 console.error(error)
    //             }); 
                
    //             messaging.onTokenRefresh( token => {
    //                 console.log("Refreshed Token: ", token);
    //             });

    //             testNotif = messaging.onMessage( async remoteMessage => {
    //                 if (AppState.currentState === "active") {
    //                     console.log('A new message arrived!', remoteMessage.data);
    //                     // Sound.setCategory('Playback');
    //                     // mySound = new Sound('zak_music.mp3',Sound.MAIN_BUNDLE,(error)=>{
    //                     //     if(error){
    //                     //         console.log('Error loading sound: ' + error);
    //                     //         return;
    //                     //     } else {
    //                     //         mySound.play((success)=>{
    //                     //             if(success){
    //                     //                 // console.log('Sound playing')
    //                     //             } else {
    //                     //                 console.log('Issue playing file');
    //                     //             }
    //                     //         })
    //                     //     }
    //                     // });
    //                     // mySound.setVolume(0.9);
    //                     // mySound.release();
    //                     // Push notification IOS
    //                     PushNotificationIOS.presentLocalNotification({
    //                         alertTitle: remoteMessage.data.title,
    //                         alertBody: remoteMessage.data.body,
    //                         isSilent: true,
    //                         // soundName: "zak_music.mp3",
    //                     });
    //                     // End Push Notification IOS
    //                     // Linking.openURL("seniorsApp://app")
    //                     // stopSound
    //                 }

    //                 // Push notification IOS
    //                 // PushNotificationIOS.presentLocalNotification({
    //                 //     alertTitle: remoteMessage.data.title,
    //                 //     alertBody: remoteMessage.data.body,
    //                 //     isSilent: true,
    //                 //     // soundName: "zak_music.mp3",
    //                 // });
    //                 // End Push Notification IOS

    //                 // Alert.alert(
    //                 //     remoteMessage.data.title,
    //                 //     remoteMessage.data.body
    //                 // );
    //             })
    //             var TOPIC = `Famille-${user.user_id}`;
    //             messaging
    //             .subscribeToTopic(TOPIC)
    //             .then(() => {
    //                 console.log(`Topic: ${TOPIC} Suscribed`);
    //             });

    //             // messaging.presentLocalNotification

    //             // messaging.setBackgroundMessageHandler(async remoteMessage => {
    //             //     console.log('Message handled in the background!', remoteMessage);
    //             // });

                
    //         } else {

    //             messaging.requestPermission()
    //             .then( async authStatus => {
    //                 console.log("APNs Status: ", authStatus);
    //                 // if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
    //                     // await firebase.messaging().registerDeviceForRemoteMessages()
    //                     messaging.getToken()
    //                     .then( token => {
    //                         console.log("Messaging Token: ", token);
    //                     }).catch( error => {
    //                         console.log("Error: " , error);
    //                     });
    //                 // }
    //             })
    //             .catch ( error => {
    //                 console.error(error);
    //             });
    //         }
    //     })
    //     // messaging().onMessage( async message => {
    //     //     console.log(message)
    //     // })
    //     // messaging().requestPermission().then( authStatus => {
    //     //     console.log('APNs Status', authStatus);
    //     //     // if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
    //     //         messaging().getToken().then( token => {
    //     //             console.log("Messaging Token: ", token);
    //     //         })
    //     //     // }
    //     // });
    //     // requestUserPermission();
    //     // var testNotif = messaging().onMessage( async remoteMessage => {
    //     //     console.log('A new message arrived!', remoteMessage.data);
    //     //     Alert.alert(
    //     //         remoteMessage.data.title,
    //     //         remoteMessage.data.body
    //     //     );
    //     // })
    //     // messaging().hasPermission
    //     // messaging.hasPermission()
    //     // .then( enabled => {
    //     //     if (enabled) {
    //     //         messaging.getToken()
    //     //         .then( token => {
    //     //             console.log("TOKEN: ", token);
    //     //             Alert.alert(token)
    //     //         })
    //     //         .catch( error => {
    //     //             console.error(error)
    //     //         }); 
                
    //     //         messaging.onTokenRefresh( token => {
    //     //             console.log("Refreshed Token: ", token);
    //     //         });

    //     //         testNotif = messaging.onMessage( async remoteMessage => {
    //     //             console.log('A new message arrived!', remoteMessage.data);
    //     //             Alert.alert(
    //     //                 remoteMessage.data.title,
    //     //                 remoteMessage.data.body
    //     //             );
    //     //         })

    //     //         messaging.setBackgroundMessageHandler(async remoteMessage => {
    //     //             console.log('Message handled in the background!', remoteMessage);
    //     //           });

                
    //     //     } else {

    //     //         messaging().requestPermission()
    //     //         .then( async authStatus => {
    //     //             console.log("APNs Status: ", authStatus);
    //     //             if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
    //     //                 // await firebase.messaging().registerDeviceForRemoteMessages()
    //     //                 messaging().getToken()
    //     //                 .then( token => {
    //     //                     console.log("Messaging Token: ", token);
    //     //                 }).catch( error => {
    //     //                     console.log("Error: " , error);
    //     //                 });
    //     //             }
    //     //         })
    //     //         .catch ( error => {
    //     //             console.error(error);
    //     //         });
    //     //     }
    //     // })
    //     // .catch( error => {
    //     //     console.error(error);
    //     // });
    // }, []);

    // requestUserPermission = async () => {
    //     const authStatus = await messaging().requestPermission();
    //     const enabled =
    //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    //     if (enabled) {
    //       getFcmToken() //<---- Add this
    //       console.log('Authorization status:', authStatus);
    //     }
    // }

    // getFcmToken = async () => {
    //     const fcmToken = await messaging().getToken();
    //     if (fcmToken) {
    //      console.log(fcmToken);
    //      console.log("Your Firebase Token is:", fcmToken);
    //     } else {
    //      console.log("Failed", "No token received");
    //     }
    // }
    

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
        
        newSocket.on('videoCall', (data) => {
            // console.warn(data)
            // console.warn(senior.senior_code)
            seniorsApi.get(`/get-senior/${user.senior_id}`).then( response => {
                // console.warn(data.senior_code, response.data.code, user.user_name, data.user, data.to)
                // setSenior(response.data);
                if (data.senior_code === response.data.code && data.user === user.user_name && data.to === 'famille'){
                    // console.warn(data.senior_code, response.data.senior_code, data.user_img)
                    setVideoCall(data);
                    // console.warn(msg);
                    setIsVideoCallModalVisible(true);
                }
            });
            
        })

        // socket.on('connection');
       
    }, []);

    const changeVideoCallModalVisible = (bool) => {
        setIsVideoCallModalVisible(bool);
    };
    

    return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" translucent={true}/>
                {/* Créer une Navbar */}
                <View style={{alignItems: "flex-end", justifyContent: "space-between", flexDirection: "row", height: "13%", width: "100%", backgroundColor: "#151515"}}>
                    <TouchableOpacity>
                        <Text style={{color: "white", marginLeft: 20, marginBottom: 20, fontSize: 30, fontWeight: "bold"}}>Contactify</Text>
                    </TouchableOpacity>
                </View>
                {
                    videoCall ? <Modal supportedOrientations={['portrait', 'landscape']} transparent={true} animationType='fade' visible={isVideoCallModalVisible} nRequestClose={() => changeVideoCallModalVisible(false)}>
                        <FamilleVideoCallModal role={role}  changeModalVisible={changeVideoCallModalVisible}  fam_name={user.user_name} senior_name={senior.prenom}  user_image={videoCall?.user_img} _checkPermissions={_checkPermissions} callData={callData} setCallData={setCallData} navigation={navigation}/>
                    </Modal> : <View></View> 
                }
                {/* <Modal supportedOrientations={['portrait', 'landscape']} transparent={true} animationType='fade' visible={true} nRequestClose={() => changeVideoCallModalVisible(false)}>
                        <FamilleVideoCallModal role={role}  changeModalVisible={changeVideoCallModalVisible}  fam_name={user.user_name} senior_name={senior.prenom}  user_image={videoCall?.user_img} _checkPermissions={_checkPermissions} callData={callData} setCallData={setCallData} navigation={navigation}/>
                    </Modal> */}

                {filterPage()}

                {/* Créer un bottom Navigation */}
                <View style={{flexDirection: "row", justifyContent: "center",alignItems: "center" , height: "10%", width: "100%", backgroundColor: "#2e2e2e"}}>
                    {/* Modifications sur le Dimension des icons et du text */}
                    <TouchableOpacity style={{width: "33%", height: "100%", alignItems: "center"}} onPress={ () => {
                        setActualite("flex");
                        setContacts("none");
                        setMonCompte("none");
                        }}>
                        {/* <View style={{backgroundColor: "white", marginTop: 10, marginBottom: 5, borderRadius: 50, justifyContent: "center", alignItems: "center"}}><FontAwesome5 name="globe-africa" size={31} color={actualite === "flex" ? "#f17c21" : "white"}/></View> */}
                        <FontAwesome5 name="globe-africa" style={{marginTop: 10, marginBottom: 5}} size={WIDTH < 400 ? 20 : 31 } color={actualite === "flex" ? "#f17c21" : "white"}/>
                        <Text style={{color: actualite === "flex" ? "#f17c21" : "white", fontSize: WIDTH < 400 ? 10 : 13}}>Actualité</Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity style={{width: "33%", height: "100%", alignItems: "center"}} onPress={ () => {
                        setActualite("none");
                        setContacts("flex");
                        setMonCompte("none");
                        }}>
                        {/* <View style={{backgroundColor: contacts === "flex" ? "#f17c21" : "white", height: 30, width: 30, marginTop: 10, marginBottom: 5, borderRadius: 50}}></View> */}
                        <Feather name="video" style={{marginTop: 10, marginBottom: 5}} size={WIDTH < 400 ? 20 : 31 } color={contacts === "flex" ? "#f17c21" : "white"}/>
                        <Text style={{color: contacts === "flex" ? "#f17c21" : "white", fontSize:  WIDTH < 400 ? 10 : 13}}>Contacts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: "33%", height: "100%", alignItems: "center"}} onPress={ () => {
                        setActualite("none");
                        setContacts("none");
                        setMonCompte("flex");
                    }}>
                        {/* <View style={{backgroundColor: monCompte === "flex" ? "#f17c21" : "white", height: 30, width: 30, marginTop: 10, marginBottom: 5, borderRadius: 50}}></View> */}
                        <MaterialCommunityIcons name="account-outline" style={{marginTop: 10, marginBottom: 5}} size={WIDTH < 400 ? 20 : 31 } color={monCompte === "flex" ? "#f17c21" : "white"}/>
                        <Text style={{color: monCompte === "flex" ? "#f17c21" : "white", fontSize:  WIDTH < 400 ? 10 : 13}}>Mon Compte</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginTop: 0,
        padding: 20,
        flex: 1,
        backgroundColor: "#ffffff"
    },
    formLabel: {
        paddingBottom: 10,
        paddingTop: 10,
        color: "#0093E9"
    },
    buttonContainer: {
        alignItems: "center",
        paddingTop: 20,
    },
    submitButton: {
        marginTop: 10,
        paddingHorizontal: 60,
        paddingVertical: 10,
        backgroundColor: "#0093E9",
        borderRadius: 25,
        alignSelf: "center"
    },
    formInput: {
        height: 40,
        backgroundColor: "#0093E9",
        color: "#ffffff",
        borderRadius: 4,
        paddingLeft: 20
    }
});

