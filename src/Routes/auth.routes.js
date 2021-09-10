import React from "react"
import AuthHome from "../Pages/AuthHome/index";
import SignInSenior from "../SeniorApp/Pages/SignInSenior/index";
import SignInFamille from "../FamilleApp/Pages/SignInFamille/index";
import RegisterFamille from "../FamilleApp/Pages/RegisterPage/index";

// import Register from "../Pages/Register/index";

import { createStackNavigator } from '@react-navigation/stack';

const AuthStack = createStackNavigator();

function AuthRoutes(){
    return (
        <AuthStack.Navigator>
            {/* Page Principal d'Authentification avec a proposition de se connecter comme senior ou membre de famille */}
            <AuthStack.Screen name='AuthHome' component={AuthHome} options={{ headerShown: false }}/>            
            {/* Page SignIn Senior */}
            <AuthStack.Screen name='SignInSenior' component={SignInSenior} options={{
                title: "SignIn Senior",
                headerStyle: {
                    backgroundColor: 'grey',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}/>
            {/* Page SignIn Famille */}
            <AuthStack.Screen name='SignInFamille' component={SignInFamille} options={{
                title: "SignIn Famille",
                headerStyle: {
                    backgroundColor: 'grey',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}/>
            <AuthStack.Screen name="RegisterFamille" component={RegisterFamille} options={{
                    title: "Register Famille",
                    headerStyle: {
                        backgroundColor: 'grey',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/>
                
            {/* Page registrer Famille */}
            {/* <AuthStack.Screen name='Register' component={Register} options={{
                    title: "SignIn",
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}/> */}
        </AuthStack.Navigator>      
    )
    
}

export default AuthRoutes;