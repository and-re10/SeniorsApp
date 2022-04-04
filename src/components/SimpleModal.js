import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native'
import axios from "axios";

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;


export default function SimpleModal(props) {

    const [ message, setMessage ] = useState("");

    const closeModal = (bool, data) => {
        props.changeModalVisible(bool);
        props.setData(data);
        if (data !==  "Cancel"){
            // let content = {
            //     msg: message,
            //     username: props.username,
            //     senior_code: props.code,
            //     photo: props.fam_image
            // }
            // props.socket.emit('hello', content);
            // console.warn(props.username)
            console.warn(`Senior-${props.senior_id}`);
            axios.post('https://senior-video-call.herokuapp.com/remote-message', {
                // Envoyer un message
                messageTitle: `Message de ${props.username}`,
                messageBody: `${message}`,
                messageUser: props.username,
                role: "senior",
                type: "Message",
                senior_code: props.code.toString(),
                user_img: props.fam_image,
                firebaseTopic: `Senior`,// Senior-${props.senior_id} //`Senior-${user.senior_id}`,// Envoyer vers le senior specifique
                // to: "senior",
                // type: "Message",// Definir le type de notification ( Appel ou Message)
                // senior_code: props.code.toString(),
                // user_img: props.fam_image,
                // firebaseTopic: `Senior-${user.senior_id}`,//`Senior-${user.senior_id}`,// Envoyer vers le senior specifique
            }).then(response => {
                var notifData = [
                    props.username,
                    message,
                    props.code,
                    props.fam_image,
                    props.senior_id
                ]
                
                console.warn("response: " + response.data);
                console.warn("notifData: " + notifData);
            }).catch(error => {
                console.error("error: " + error);
            });
        }
    };

    

    return (
        <TouchableOpacity disabled={true} style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <View style={{height: 200, width: "90%", paddingTop: 10, backgroundColor: 'white', borderRadius: 10}}>
                <View style={{flex: 1, alignItems: "center"}}>
                    <Text style={{marginHorizontal: 5, marginVertical: 20, fontSize: 20, fontWeight: 'bold'}}>Ecrivez une notification a {props.senior_name}</Text>
                    
                    <TextInput placeholder="Ecrivez un message" value={message} style={{padding: 10 ,width: "90%", borderWidth: 1, borderColor: "grey", borderRadius: 10, marginVertical: 20}} onChangeText={text => setMessage(text)}></TextInput>
                </View>
                <View style={{width: "100%", flexDirection: "row"}}>
                    <TouchableOpacity style={{flex: 1, paddingVertical: 10, alignItems: "center"}} onPress={() => closeModal(false, "Cancel")}>
                        <Text style={{margin: 5, fontSize: 16, fontWeight: 'bold', color: "blue"}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, paddingVertical: 10, alignItems: "center"}} onPress={() => closeModal(false, message)}>
                        <Text style={{margin: 5, fontSize: 16, fontWeight: 'bold', color: "blue"}}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </TouchableOpacity>
    )
}
