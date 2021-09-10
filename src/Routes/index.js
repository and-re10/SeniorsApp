import React, { useEffect, useContext } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AuthContext from "../contexts/auth";

import SeniorAppRoutes from "./seniorApp.routes";
import FamilleAppRoutes from "./familleApp.routes";
import AuthRoutes from "./auth.routes";

// Firebase Push Notifications
// import firebase from "react-native-firebase";
// import firebase from '@react-native-firebase/app';
// import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

function Routes(){
    const { signed, loading, role } = useContext(AuthContext);

    // if (loading){
    //     return (
    //         <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
    //             <ActivityIndicator size="large"/>
    //         </View>
    //     );
    // };const { signed, loading, role, user } = useContext(AuthContext);

//   var testNotif = null;
//   const messaging = firebase.messaging();

//     useEffect(() => {
//         messaging.hasPermission().then( enabled => {
//             if (enabled) {
//                 messaging.getToken()
//                 .then( token => {
//                     console.log("TOKEN: ", token);
//                     // Alert.alert(token)
//                     // setFBToken(token);
//                 })
//                 .catch( error => {
//                     console.error(error)
//                 }); 
                
//                 messaging.onTokenRefresh( token => {
//                     console.log("Refreshed Token: ", token);
//                 });

//                 testNotif = messaging.onMessage( async remoteMessage => {
//                     if (AppState.currentState === "active") {
//                         console.log('A new message arrived!', remoteMessage.data);
//                         // Push notification IOS
//                         PushNotificationIOS.presentLocalNotification({
//                             alertTitle: remoteMessage.data.title,
//                             alertBody: remoteMessage.data.body,
//                             isSilent: true,
//                             // soundName: "zak_music.mp3",
//                         });
//                         // End Push Notification IOS
//                         // Linking.openURL("seniorsApp://app")
//                         // stopSound
//                     }
//                 })
//                 console.warn(role);

//                 if (role === "senior"){
//                     var TOPIC = `Senior-${user.user_id}`;
//                 } else {
//                     var TOPIC = `Famille-${user.user_id}`;
//                 }
                
//                 messaging
//                 .subscribeToTopic(TOPIC)
//                 .then(() => {
//                     console.log(`Topic: ${TOPIC} Suscribed`);
//                 });
//             } else {

//                 messaging.requestPermission()
//                 .then( async authStatus => {
//                     console.log("APNs Status: ", authStatus);
//                     // if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
//                         // await firebase.messaging().registerDeviceForRemoteMessages()
//                         messaging.getToken()
//                         .then( token => {
//                             console.log("Messaging Token: ", token);
//                         }).catch( error => {
//                             console.log("Error: " , error);
//                         });
//                     // }
//                 })
//                 .catch ( error => {
//                     console.error(error);
//                 });
//             }
//         })
//     }, []);


    return !signed? <AuthRoutes/> : role === "senior"? <SeniorAppRoutes/> : <FamilleAppRoutes/>;
    // return <AppRoutes/>;
}

export default Routes;
