import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from "../SeniorApp/Pages/HomePage/index";
import SeniorApp from "../SeniorApp/index";
import DetailsPage from "../SeniorApp/Pages/DetailsPage/index";
import VideoPage from "../FamilleApp/Pages/ContactsPage/VideoPage/index";
// import SearchScreen from "../Pages/SearchScreen/index";
// import VideoScreen from "../Pages/VideoScreen/index";

const Stack =  createStackNavigator();

export default function SeniorAppRoutes() {
    return (
            <Stack.Navigator>
                <Stack.Screen name="Home" component={SeniorApp} options={{ headerShown: false }}/>
                <Stack.Screen name="Details" component={DetailsPage} options={{ 
                    title: "Details",
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/>
                <Stack.Screen name="Video" component={VideoPage} options={{ 
                    title: "Video",
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerBackTitle: "Retour",
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/>
                {/* <Stack.Screen name="Search" component={SearchScreen} options={{
                    title: "Search",
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/>
                <Stack.Screen name="Video" component={VideoScreen} options={{
                    title: "Video",
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/> */}
            </Stack.Navigator>
    )
}
