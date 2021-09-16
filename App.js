import React, {useEffect, useContext} from 'react';
import {AppState} from "react-native";
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import Routes from "./src/Routes/index";
// import AppRoutes from "./src/Routes/app.routes";
import { AuthProvider } from "./src/contexts/auth";
import AuthContext from "./src/contexts/auth";

// Firebase Push Notifications
// import firebase from "react-native-firebase";
// // import firebase from '@react-native-firebase/app';
// import messaging from '@react-native-firebase/messaging';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";

export default function App() {

//   const { signed, loading, role, user } = useContext(AuthContext);

//   var testNotif = null;
//   const messaging = firebase.messaging();

//   useEffect(() => {
//     messaging.hasPermission().then( enabled => {
//         if (enabled) {
//             messaging.getToken()
//             .then( token => {
//                 console.log("TOKEN: ", token);
//                 // Alert.alert(token)
//                 // setFBToken(token);
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
//             })
//             console.warn(user);

//             if (role === "senior"){
//               var TOPIC = `Senior-${user.user_id}`;
//             } else {
//               var TOPIC = `Famille-${user.user_id}`;
//             }
            
//             messaging
//             .subscribeToTopic(TOPIC)
//             .then(() => {
//                 console.log(`Topic: ${TOPIC} Suscribed`);
//             });
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
// }, []);

  const colors = {
    bg : 'white',
    color: 'black'
  }
  // const navigation = useNavigation();
  return (
    <NavigationContainer>
        <AuthProvider>
          <ThemeProvider theme={colors}>
            <Routes/>
          </ThemeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}


