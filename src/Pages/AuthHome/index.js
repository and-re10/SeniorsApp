import React from 'react'
import { View, Text, Button, TouchableOpacity, Dimensions } from 'react-native'

const WIDTH = Dimensions.get('window').width;

export default function AuthHome({ navigation }) {
    return (
        <View style={{flex: 1, alignItems: "center", backgroundColor: "#f4f4f4"}}>
            <Text style={{fontSize: WIDTH < 400 ? 15 : 20, fontWeight: "bold", marginVertical: 100}}>Bien venu sur TABTAB. </Text>
            <Text style={{fontSize: WIDTH < 400 ? 15 : 20, width: "70%"}}>
                Connectez-vous comme Senior:
            </Text>
            <TouchableOpacity style={{backgroundColor: "black", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "70%", marginVertical: 25}} onPress={() => { navigation.navigate('SignInSenior') }}>
                <Text style={{color: "white", paddingVertical: WIDTH < 400 ? 15 : 18, fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20}}>COMPTE SENIOR</Text>
            </TouchableOpacity>

            <Text style={{fontSize: WIDTH < 400 ? 15 : 20, width: "70%"}}>
                Connectez-vous comme Membre de famille:
            </Text>
            <TouchableOpacity style={{backgroundColor: "black", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "70%", marginVertical: 25}} onPress={() => { navigation.navigate('SignInFamille') }}>
                <Text style={{color: "white", paddingVertical: WIDTH < 400 ? 15 : 18, fontWeight: "bold", fontSize: WIDTH < 400 ? 15 : 20, textAlign: "center"}}>COMPTE{"\n"}MEMBRE DE FAMILLE</Text>
            </TouchableOpacity>
        {/* <Button title="Senior" onPress={() => navigation.navigate('SignInSenior')}/>
        <Button title="Membre de Famille" onPress={() => navigation.navigate('SignInFamille')}/> */}
        </View>
    )
}
