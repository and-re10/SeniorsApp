import React, { useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import Sound from 'react-native-sound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;


export default function SeniorVideoCallModal(props) {

    
    useEffect(() => {
        console.warn(props.fam_image)
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
    })

    stopSound = () => {
        mySound.pause()
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
                        stopSound()
                        closeModal(false)
                    }}>
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}>Raccrocher</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: "green", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "40%", height: 100}} onPress={() => {
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
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}>Décrocher</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
            
        </TouchableOpacity>
    )
}
