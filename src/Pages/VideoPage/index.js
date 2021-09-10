import React, { useState, useEffect } from 'react';
import { View, Text, Button, Stylesheet, NativeModules, Platform } from 'react-native';
// import { RtcEngine, AgoraView } from 'react-native-agora';
// import RtcEngine, {AgoraView} from "react-native-agora";

// const { Agora } = NativeModules;
// const {
//     FPS30,
//     AudioProfileDefault,
//     AudioScenarioDefault,
//     Adaptative
// } = Agora;


export default function VideoPage({ route, navigation }) {

    // const [videoCall, setVideoCall] = useState(true);
    const {AppID, ChannelName} = route.params;

    const [peerIds, setPeerIds] = useState([]);
    const [uid, setUid] = useState(Math.random()*100);
    const [vidMute, setVideMute] = useState(false);
    const [audMute, setAudMute] = useState(false);
    const [joinSucceed, setJoinSucceed] = useState(false);
    
    // if(Platform.OS === "android"){
    //     const config = {
    //         appid: AppID,
    //         channelProfile: 0,
    //         videoEncodedConfig: {
    //             width: 720,
    //             height: 1080,
    //             bitrate: 1,
    //             frameRate: FPS30,
    //             orientationMode: Adaptative,
    //         },
    //         audioProfie: AudioProfileDefault,
    //         audioScenario: AudioScenarioDefault,
    //     };
    //     RtcEngine.init(config);
    // };

    // useEffect(() => {
    //     RtcEngine.create(AppID);
    //     RtcEngine.on('userJoined', (data) => {
    //         if (peerIds.indexOf(data.uid) === -1) {
    //             setPeerIds([...peerIds, data.uid]);
    //         };
    //     });
    //     RtcEngine.on('UserOffline', (data) => {
    //         setPeerIds(
    //             peerIds.filter(uid => uid !== data.uid),
    //         );
    //     });
    //     RtcEngine.on('joinChannelSuccess', (data) => {
    //         RtcEngine.startPreview();
    //         setJoinSucceed(true);
    //     });
    //     RtcEngine.joiChannel(ChannelName, uid);
    //     RtcEngine.enableAudio();
    // }, []);

    // toggleAudio = () => {
    //     let mute = audMute;
    //     console.log('audi toggle', mute);
    //     RtcEngine.muteLocalAudioStream(!mute);
    //     setAudMute(!mute);
    // };

    // toggleVideo = () => {
    //     let mute = vidMute;
    //     console.log('Video toggle', mute);
    //     setAudMute(!mute);
    //     RtcEngine.muteLocalVideoStream(!mute);
    // };

    // endCall = () => {
    //     RtcEngine.destroy();
    //     navigation.navigate("Home");
    // }

    // let rtcProps = {
    //     appid: "576cb310cd4a4792bfc98921f5576351",
    //     channel: "test"
    // }

    // let callbacks = {
    //     onEndCall: () => setVideoCall(false)
    // }

    // return videoCall ? <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks}/> : <></>
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            {/* <Text>Video Page</Text>
            <Text>App ID: { AppID }</Text>
            <Text>Channel Name: { ChannelName }</Text>
            <Button title="Go Back" onPress={() => navigation.goBack()}/> */}
            {/* <AgoraView style={{width: 140, height: 160, position: "absolute", top: 5, roght: 5, zIndex: 100}} zOrderMediaOverlay={true} showLocalVideo={true} mode={1}/> */}
        </View>
    )
}

// const styles = Stylesheet.create({

// });
