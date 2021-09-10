import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Dimensions, Text, TouchableOpacity, View, Button, Image, Modal, RefreshControl, AppState, ScroolView } from 'react-native';
import AuthContext from "../contexts/auth";
import seniorsApi from "../api/app";
import { io } from "socket.io-client";
import SimpleModal from "../components/SeniorModal";
import VideoCallModal from "../components/VideoCallModal";
import CallFamillyModal from "../components/CallFamillyModal";
import getCurrentWeather from "../api/weatherApi";
// import axios from 'axios';

import {
    checkMultiple,
    request,
    requestMultiple,
    PERMISSIONS,
    RESULTS,
} from 'react-native-permissions';

// Icons
import IconFeather from 'react-native-vector-icons/Feather';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

// Firebase Push Notifications
// import firebase from "react-native-firebase";
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

// import AuthContext from "../contexts/auth";

// const { width, height } = Dimensions.get("window");

// const guidelineBaseWidth = 350;
// const guidelineBaseHeight = 680;

// const scale = size => width / guidelineBaseWidth * size;
// const verticalScale = size => height / guidelineBaseHeight * size;
// const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// export { scale, verticalScale, moderateScale };

// const Component = props => (
//     <View style={{width: scale(30), height: verticalScale(50), pading: moderateScale(5)}}/>
// );

export default function SeniorPage({ navigation }) {

    const { signed, loading, user, role, signOut, callData, setCallData } = useContext(AuthContext);
    const [ famille, setFamille ] = useState([]);

    // Modal
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ isVideoCallModalVisible, setIsVideoCallModalVisible ] = useState(false);
    const [ isCallFamillyModalVisible, setIsCallFamillyModalVisible ] = useState(true);
    const [ famillyCallData, setFamillyCallData ] = useState(null);
    const [ chooseData, setChooseData ] = useState()

    // Notifications
    const [ socket, setSocket ] = useState();
    const [ messages, setMessages ] = useState([]);
    const [ videoCall, setVideoCall ] = useState([]);

    // Weather API
    // Current, Min, Max, Location, wind, humidity, weatherDescription
    const [ currentTemp, setCurrentTemp ] = useState("");
    const [ minTemp, setMinTemp ] = useState("");
    const [ maxTemp, setMaxTemp ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ wind, setWind ] = useState("");
    const [ humidity, setHumidity ] = useState("");
    const [ currentDate, setCurrentDate ] = useState("");
    const [ currentHour, setCurrentHour ] = useState("");
    const [ weatherDescription, setWeatherDescription ] = useState("");

    // Refreching
    // const [ refreshing, setRefreshing ] = useState(false)

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

    // async function getCurrentWeather(location){
    
    //     const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=bruxelles&appid=c4b0571106953ff07a67bc88f9acb831`)
    //     // .then( response => {
    
    //     const data = response.data;
    //     const locationName = (`${data?.sys.country}, ${data?.name}`);
    //     const temperatureMin = data?.main.temp_min;
    //     const temperatureMax = data?.main.temp_max;
    //     const wind = data?.wind.speed;
    //     const humidity = data?.main.humidity;
    //     const currentTemperature = data?.main.temp;
    
    //     results = [ currentTemperature, temperatureMin, temperatureMax, locationName, wind, humidity ]
    //     // console.warn(response);
    
            
    //     // })
    //     // .catch( error => {
    //     //     console.error(error);
            
    //     // });

    //     return results;
    
        
    // }

    function getCurrentDate(){
        var date = new Date();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today = date.toLocaleDateString("fr-BE", options)
        var convert = today.substr(0, 1).toUpperCase() + today.substr(1)
        // console.warn(convert)
        setCurrentDate(convert)
    } 

    function getCurrentHour(){
        let date = new Date();
        // console.warn(date.getHours() + ":" + date.getMinutes())
        setCurrentHour(date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2))
    }
    
    useEffect(() => {
        getCurrentDate();
        let secTimer = setInterval( () => {
            getCurrentHour()
        },1000)
      
        return () => clearInterval(secTimer);
        
    }, [])

    async function setCurrentWeather(){
        // Current, Min, Max, Location, wind, humidity
        const data = await getCurrentWeather("bruxelles");
        // clear sky, few clouds, scattered clouds, broken clouds, 	shower rain, rain, thunderstorm, snow, mist
        // currentTemperature, temperatureMin, temperatureMax, locationName, wind, humidity, weatherDescription
        setCurrentTemp(convertKelvinInC(data[0]));
        setMinTemp(convertKelvinInC(data[1]));
        setMaxTemp(convertKelvinInC(data[2]));
        setLocation(data[3]);
        setWind(data[4]);
        setHumidity(data[5]);
        setWeatherDescription(data[6]);


        console.warn(data);
    }

    function convertKelvinInC(kelvin){
        return parseInt(kelvin - 273)
    }

    // Start Menus
    // Get menu of the day
    const [ maisonRepo, setMaisonRepo ] = useState([]);
    const [ menus, setMenus ] = useState([]);

    useEffect(() => {
        console.log(user.user_id);
        seniorsApi.get(`/get-senior/${user.user_id}`).then(response => {
            console.warn(response.data.maison_repo_id)
            seniorsApi.get(`/get-maison-repo/${response.data.maison_repo_id}`).then(response => {
                // console.warn(response.data);
                setMaisonRepo(response.data);
            });
            // console.warn(response.data.maison_repo_id)
            seniorsApi.get(`/get-menus/${response.data.maison_repo_id}`).then(response => {
                setMenus(response.data);
                console.warn(response.data)
            })
        })
    }, []);

    // End Menus 

    // var testNotif = null;
    // const messaging = firebase.messaging();

    var testNotif = null;
//   const messaging = firebase.messaging();

    useEffect(() => {
        messaging().hasPermission().then( enabled => {
            if (enabled) {
                messaging().getToken()
                .then( token => {
                    console.log("TOKEN: ", token);
                    // Alert.alert(token)
                    // setFBToken(token);
                })
                .catch( error => {
                    console.error(error)
                }); 
                
                messaging().onTokenRefresh( token => {
                    console.log("Refreshed Token: ", token);
                });

                // testNotif = messaging.onMessage( async remoteMessage => {
                //     if (AppState.currentState === "active") {
                //         console.log('A new message arrived!', remoteMessage.data);
                //         // Push notification IOS
                //         PushNotificationIOS.presentLocalNotification({
                //             alertTitle: remoteMessage.data.title,
                //             alertBody: remoteMessage.data.body,
                //             isSilent: true,
                //             // soundName: "zak_music.mp3",
                //         });
                //         // End Push Notification IOS
                //         // Linking.openURL("seniorsApp://app")
                //         // stopSound
                //     }
                // })
                // console.warn(role);

                // if (role === "senior"){
                    var TOPIC = `Senior-${user.user_id}`;
                // } else {
                //     var TOPIC = `Famille-${user.user_id}`;
                // }
                
                messaging()
                .subscribeToTopic(TOPIC)
                .then(() => {
                    console.log(`Topic: ${TOPIC} Suscribed`);
                });
            } else {

                messaging().requestPermission()
                .then( async authStatus => {
                    console.log("APNs Status: ", authStatus);
                    // if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
                        // await firebase.messaging().registerDeviceForRemoteMessages()
                        messaging().getToken()
                        .then( token => {
                            console.log("Messaging Token: ", token);
                        }).catch( error => {
                            console.log("Error: " , error);
                        });
                    // }
                })
                .catch ( error => {
                    console.error(error);
                });
            }
        })
    }, []);

    useEffect(() => {
        _checkPermissions();
        setCurrentWeather();
        // console.warn(AppState.currentState);
        // messaging.hasPermission().then( enabled => {
        //     if (enabled) {
        //         messaging.getToken()
        //         .then( token => {
        //             console.log("TOKEN: ", token);
        //             // Alert.alert(token)
        //             // setFBToken(token);
        //         })
        //         .catch( error => {
        //             console.error(error)
        //         }); 
                
        //         messaging.onTokenRefresh( token => {
        //             console.log("Refreshed Token: ", token);
        //         });

        //         testNotif = messaging.onMessage( async remoteMessage => {
        //             // if (remoteMessage.data.user === "andre") {
        //             //     console.log('A new message arrived!', remoteMessage.data);
        //             //     // Push notification IOS
        //             //     PushNotificationIOS.presentLocalNotification({
        //             //         alertTitle: remoteMessage.data.title,
        //             //         alertBody: remoteMessage.data.body,
        //             //         isSilent: true,
        //             //         // soundName: "zak_music.mp3",
        //             //     });
        //             //     // End Push Notification IOS
        //             //     // Linking.openURL("seniorsApp://app")
        //             //     // stopSound
        //             // }
        //         })
        //         var TOPIC = `Senior-${user.user_id}`;
        //         messaging
        //         .subscribeToTopic(TOPIC)
        //         .then(() => {
        //             console.log(`Topic: ${TOPIC} Suscribed`);
        //         });
                
        //     } else {

        //         messaging.requestPermission()
        //         .then( async authStatus => {
        //             console.log("APNs Status: ", authStatus);
        //             // if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
        //                 // await firebase.messaging().registerDeviceForRemoteMessages()
        //                 messaging.getToken()
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
    }, []);
    

    // useEffect(() => {
    //     // Get senior data
    //     seniorsApi.get(`/get-senior-famille/${user.user_id}`).then( response => {
    //         // console.warn(response.data)
    //         setFamille(response.data);
    //     });
    // }, []);

    useEffect(() => {
        // Get senior data
        seniorsApi.get(`/get-senior-famille/${user.user_id}`).then( response => {
            // console.warn(response.data)
            setFamille(response.data);
        });
        const newSocket = io('https://seniors-app-notification.herokuapp.com/');   
        setSocket(newSocket);
        newSocket.on("hello", (msg) => {
            if (msg.senior_code === user.senior_code){
                // console.warn(msg.senior_code, user.senior_code)
                setMessages(msg);
                // console.warn(msg);
                setIsModalVisible(true);
            }
            
        });
        newSocket.on('videoCall', (data) => {
            if (data.senior_code === user?.senior_code && data?.to === "senior"){
                // console.warn(data.senior_code, user.senior_code, data.user_img)
                setVideoCall(data);
                // console.warn(msg);
                setIsVideoCallModalVisible(true);
            }
        })
        
    }, [])

    function handleSignOut(){
        signOut();
    }


    const changeModalVisible = (bool) => {
        setIsModalVisible(bool);
        setMessages([])
    };

    const changeVideoCallModalVisible = (bool) => {
        setIsVideoCallModalVisible(bool);
    };

    const changeCallFamillyModalVisible = (bool) => {
        setIsCallFamillyModalVisible(bool);
    };

    const weatherIcon = (description) => {
        // v:clear sky, v:few clouds, v:scattered clouds, v:broken clouds, 	v:shower rain, v:rain, v:thunderstorm, v:snow, v:mist
        switch (description) {
            case "clear sky":
                return (<IconFeather name="sun" size={38}/>)
            case "few clouds":
                return (<Fontisto name="day-cloudy" size={38}/>)
            case "scattered clouds":
                return (<IconFeather name="cloud" size={38}/>)
            case "broken clouds":
                return (<IconFeather name="cloud" size={38}/>)
            case "shower rain":
                return (<IconFeather name="cloud-rain" size={38}/>)
            case "snow":
                return (<IconFeather name="cloud-snow" size={38}/>)
            case "rain":
                return (<IconFeather name="cloud-drizzle" size={38}/>)
            case "thunderstorm":
                return (<IconIonicons name="thunderstorm-outline" size={38}/>)
            case "mist":
                return (<IconFeather name="wind" size={38}/>)
            default:
                return (<Text>Icon non trouvé</Text>)
        }
    }
    


    // const showModal = () => {
    //     messages ? <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={() => changeModalVisible(false)}>
    //         <SimpleModal changeModalVisible={changeModalVisible} message={messages.message} test={messages} username={messages.user}/>
    //     </Modal> : <View></View>
    // }

    // const showmodal = () => {
        
    // }

    // const isTabletOrMobileDevice = useMediaQuery({    
    //     maxDeviceWidth: 1224,
    //     // alternatively...
    //     query: "(max-device-width: 1224px)"  
    // });

    // if (isTabletOrMobileDevice) {
    //     return (<Text>Hi Mobile Users 👋</Text>)
    // }
    return (
        <View style={{flex: 1}}>
            
            { 
                // messages?.map((elem, index) => {
                //     // setIsModalVisible(true);
                //     return (
                //         // <Text color="white">{elem}</Text>
                //         <Modal key={index} transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={() => changeModalVisible(false)}>
                //             <SimpleModal changeModalVisible={changeModalVisible} message={elem}/>
                //         </Modal>
                //     )
                // })
                messages ? <Modal supportedOrientations={['portrait', 'landscape']} transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={() => changeModalVisible(false)}>
                    <SimpleModal  changeModalVisible={changeModalVisible} message={messages.message} username={messages.user}/>
                </Modal> : <View></View> 
            }
            {
                videoCall ? <Modal supportedOrientations={['portrait', 'landscape']} transparent={true} animationType='fade' visible={isVideoCallModalVisible} nRequestClose={() => changeVideoCallModalVisible(false)}>
                    <VideoCallModal  changeModalVisible={changeVideoCallModalVisible} role={role}  fam_name={videoCall?.user} senior_name={user.user_name}  image_senior={videoCall?.user_img} _checkPermissions={_checkPermissions} callData={callData} setCallData={setCallData} navigation={navigation}/>
                </Modal> : <View></View> 
            }
            {
                famillyCallData ? <Modal supportedOrientations={['portrait', 'landscape']} transparent={true} animationType='fade' visible={isCallFamillyModalVisible} nRequestClose={() => changeCallFamillyModalVisible(false)}>
                    <CallFamillyModal  changeModalVisible={changeCallFamillyModalVisible} fam_id={famillyCallData?.id}  fam_name={famillyCallData?.userName} senior_name={user?.user_name}  image_senior={famillyCallData?.photo} _checkPermissions={_checkPermissions} callData={callData} setCallData={setCallData} navigation={navigation} senior_code={user?.senior_code} socket={socket}/>
                </Modal> : <View></View> 
            }
            
            <View style={{height: "90%", width: "100%", flexDirection: "row"}}>
                {/* Top */}
                {/* Left */}
                <View style={{width: "75%", height: "100%"}}>
                    {/* Left Top */}
                    <View  style={{width: "100%", height: "55%", backgroundColor: "black", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", alignContent: "space-around"}}>
                    
                        {famille.map((elem, index) => {
                            return (
                                <TouchableOpacity key={index} style={{height: 190, width: 190, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}} onPress={() => { 
                                    setFamillyCallData({
                                        userName: elem.prenom,
                                        photo: elem.photo_profil,
                                        id: elem.id
                                    });
                                    changeCallFamillyModalVisible(true)
                                    // navigation.navigate('Video')
                                    // _checkPermissions(() => {
                                    //     fetch(`https://senior-video-call.herokuapp.com/getToken?userName=${user.user_name}?roomName=test`)
                                    //     .then((response) => {
                                    //         console.warn(user.user_name)
                                    //         if (response.ok) {
                                    //             // console.warn(response)
                                    //             response.text().then((jwt) => {
                                    //                 console.warn(jwt)
                                    //                 setCallData({...callData, token: jwt});
                                    //                 navigation.navigate('Video');
                                    //                 return true;
                                    //             });
                                    //         } else {
                                    //             response.text().then((error) => {
                                    //             Alert.alert(error);
                                    //             });
                                    //         }
                                    //     })
                                    //     .catch((error) => {
                                    //         console.log('error', error);
                                    //         Alert.alert('API not available');
                                    //     });
                                    // });
                                }}>
                                    <Image source={{uri: `https://test.tabtab.eu/storage/images/${elem?.photo_profil}`}}
                                    style={{height:"100%", width: "100%", borderRadius: 100}} />
                                    <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>{elem.prenom}</Text>
                                </TouchableOpacity>
                            )
                        })}
                        {/* <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height: 85, width: 85, backgroundColor: "grey", borderRadius: 100, marginTop: 5, marginBottom: 2.5, marginHorizontal: 5, position: "relative"}}>
                            <Text style={{position: "absolute", bottom: 15, width: "100%", textAlign: "center", fontSize: 10, fontWeight: "bold", color: "white"}}>Bernard</Text>
                        </TouchableOpacity> */}
                    </View>
                    {/* Left Bottom */}
                    {menus?.map((menu, index) => {
                        return (
                            <View style={{width: "100%", height: "45%", backgroundColor: "white", alignItems: "center"}}>
                                <View style={{borderBottomWidth: 1, borderBottomColor: "black", height: "15%", paddingHorizontal: 20}}>
                                    <Text style={{width: "35%", fontSize: 15, textAlign: "center", marginTop: 5}}>Menu du Jour:</Text>
                                </View>
                                <View style={{height: "85%", flexDirection: "row"}}>
                                    <View style={{height: "100%", width: "10%", justifyContent: "center", alignItems: "center"}}>
                                        <TouchableOpacity style={{backgroundColor: "#f17c21", paddingHorizontal: 10, justifyContent: "center", alignItems: "center"}}> 
                                            <Text style={{fontSize: 20}}>+</Text> 
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{height: "100%", width: "80%", justifyContent: "space-around", alignItems: "center"}}>
                                        <Text style={{fontSize: 20}}>{menu.entree_dejeuner}</Text>
                                        <Text style={{fontSize: 20}}>{menu.plat_dejeuner}</Text>
                                        <Text style={{fontSize: 20}}>{menu.desser_dejeuner}</Text>
                                    </View>
                                    <View style={{height: "100%", width: "10%", justifyContent: "center", alignItems: "center"}}>
                                        <TouchableOpacity style={{backgroundColor: "#f17c21", paddingHorizontal: 10, justifyContent: "center", alignItems: "center"}}> 
                                            <Text style={{fontSize: 20}}>+</Text> 
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            </View>
                        )}
                    )}
                    
                </View>
                {/* Right */}
                <View style={{width: "25%", height: "100%", backgroundColor: "#efefe7"}}>
                    <Button title="logout" onPress={() => handleSignOut()}/>
                    <Button title="refresh" onPress={() => setCurrentWeather()}/>
                    <View style={{height: "33.33%", justifyContent: "center", alignItems: "center"}}>
                        {/* Heure */}
                        <Text style={{fontSize: 90, fontWeight: "bold"}}>{currentHour}</Text>
                    </View>

                    <View style={{height: "33.33%", justifyContent: "center", alignItems: "center"}}>
                        {/* Date */}
                        <Text style={{fontSize: 45, fontWeight: "bold", textAlign: "center", paddingHorizontal: 30}}>{currentDate}</Text>
                    </View>

                    <View style={{height: "33.33%", justifyContent: "flex-start", alignItems: "center"}}>
                        {/* Meteo */}
                        <Text style={{fontSize: 30, marginVertical: 20}}>Aujourd'hui:</Text>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                            {/* Left */}
                            <View style={{width: "50%", paddingRight: 10, alignItems: "flex-end"}}>
                                {/* Icon */}
                                {/* // v:clear sky, v:few clouds, v:scattered clouds, v:broken clouds, 	v:shower rain, v:rain, v:thunderstorm, v:snow, v:mist */}
                                {/* weatherDescription */}
                                {weatherIcon(weatherDescription)}
                                {/* <IconFeather name="cloudo" size={38}/> */}
                                {/* <View style={{height: 24, width: 24, backgroundColor: "black", marginTop: 7}}></View> */}
                            </View>
                            {/* Right */}
                            <View style={{width: "50%", paddingLeft: 10, flexDirection: "row"}}>  
                                {/* Temperature */}
                                <Text style={{fontSize: 40, fontWeight: "bold"}}>{currentTemp}</Text>
                                <Text style={{fontSize: 20, fontWeight: "bold"}}>c</Text>
                                <Text style={{fontSize: 15, marginTop: 3}}>°</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            {/* Bottom */}
            <View style={{height: "10%", width: "100%", backgroundColor: "black", flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "green"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "green"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "green"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "green"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "green"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "green"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "green"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                <View style={{height: "80%", width: "3.5%", backgroundColor: "#363636"}}></View>
                
            </View>
        </View>
    )
}
