import React from 'react'
import { View, Text, Button } from 'react-native'

export default function DetailsPage({route, navigation}) {

    const { nom, prenom, age } = route.params;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Details Page</Text>
            <View style={{ height: 300, width: 300, backgroundColor: "green", justifyContent: "space-around" }}>
                <Text style={{backgroundColor: "yellow", textAlign: "center" }}>Nom: { nom }</Text>
                <Text style={{backgroundColor: "orange", textAlign: "center" }}>Prenom: { prenom }</Text>
                <Text style={{backgroundColor: "lightblue", textAlign: "center" }}>Age: { age }</Text>
            </View>
            <Button title="Go Back" onPress={() => navigation.navigate('Home')}/>
        </View>
    )
}
