import React from 'react'
import { View, Text, Button } from 'react-native'

export default function AuthHome({ navigation }) {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>Auth Home Page</Text>
        <Button title="Senior" onPress={() => navigation.navigate('SignInSenior')}/>
        <Button title="Membre de Famille" onPress={() => navigation.navigate('SignInFamille')}/>
        </View>
    )
}
