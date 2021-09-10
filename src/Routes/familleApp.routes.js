import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ActualitePage from "../FamilleApp/Pages/ActualitePage/index";
import DetailsPage from "../FamilleApp/Pages/DetailsPage/index";
import VideoPage from "../FamilleApp/Pages/ContactsPage/VideoPage/index";
import FamillePage from "../FamilleApp/index";
// import SearchScreen from "../Pages/SearchScreen/index";
// import VideoScreen from "../Pages/VideoScreen/index";

const Stack =  createStackNavigator();

export default function FamilleAppRoutes() {
    return (
            <Stack.Navigator>
                <Stack.Screen name="Home" component={FamillePage} options={{ headerShown: false }}/>
                <Stack.Screen name="Details" component={DetailsPage} options={{ 
                    title: "Details",
                    headerStyle: {
                        backgroundColor: 'grey',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/>
                <Stack.Screen name="Video" component={VideoPage} options={{ 
                    title: "Video",
                    headerStyle: {
                        backgroundColor: 'grey',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/>
                
            </Stack.Navigator>
    )
}
