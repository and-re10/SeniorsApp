import React, { useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;


export default function SeniorNotifModal(props) {

    useEffect(() => {
        console.warn(props.fam_image)
        // Sound.setCategory('Playback');
        mySound = new Sound('Pop_Ding_Notification_Sound_01.wav',Sound.MAIN_BUNDLE,(error)=>{
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
            <View style={{height: "60%", width: "70%", paddingTop: 10, backgroundColor: 'white', borderRadius: 10, justifyContent: "space-around", position: "relative"}}>
                <View style={{height: "25%", width: "100%", alignItems: "center", marginBottom: 20, position: "absolute", top: "-20%"}}>
                    {/* <MaterialIcons name="add-alert" size={100} color="#ec611d"/> */}
                    <Image source={{uri: `https://test.tabtab.eu/storage/images/${props.fam_image}`}}
                    style={{height: 200, width: 200, borderRadius: 200}} />
                    {/* <View style={{height: 200, width: 200, borderRadius: 200, backgroundColor: "black"}}></View> */}
                    <Text style={{marginHorizontal: 5, marginTop: 10, marginBottom: 20, fontSize: 30, fontWeight: "bold"}}>{props.username} dit: </Text>
                </View>
                <View style={{height: "60%", width: "100%", alignItems: "center", marginBottom: 20}}>
                    <Text style={{marginHorizontal: 76, fontSize: 50, fontWeight: 'bold', textAlign: "center", paddingVertical: 50}}>{props.message}</Text>
                </View>
                <View style={{width: "100%", height: "15%", flexDirection: "row", justifyContent: "center", position: "absolute", bottom: "-4%"}}>
                    <TouchableOpacity style={{ width: "70%", height: 100, backgroundColor: "#891812", borderRadius: 10, justifyContent: "center", alignItems: "center"}} onPress={() => closeModal(false, "OK")}>
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 40}}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </TouchableOpacity>
    )
}
