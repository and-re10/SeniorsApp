import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT_MODAL = 150;


export default function SimpleModal(props) {

    
    const closeModal = (bool) => {
        props.changeModalVisible(bool);
        // props.setData(data);
    };

    return (
        <TouchableOpacity disabled={true} style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <View style={{height: 200, width: "90%", paddingTop: 10, backgroundColor: 'white', borderRadius: 10, justifyContent: "space-around"}}>
                <View style={{flex: 1, alignItems: "center", marginBottom: 20}}>
                    <Text style={{marginHorizontal: 5, marginTop: 10, marginBottom: 20}}>{props.username} dit: </Text>
                    <Text style={{margin: 5, fontSize: 16, fontWeight: 'bold'}}>{props.message}</Text>
                </View>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "center"}}>
                    <TouchableOpacity style={{marginVertical: 10, backgroundColor: "#3b3b3b", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "80%"}} onPress={() => closeModal(false, "OK")}>
                        <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </TouchableOpacity>
    )
}
