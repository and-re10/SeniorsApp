import React from "react"
import AuthHome from "../Pages/AuthHome/index";
import SignInSenior from "../SeniorApp/Pages/SignInSenior/index";
import SignInFamille from "../FamilleApp/Pages/SignInFamille/index";
import RegisterFamille from "../FamilleApp/Pages/RegisterPage/index";
import GetEmailPage from "../FamilleApp/Pages/ForgotPassword/GetEmailPage";
import GetCodePage from "../FamilleApp/Pages/ForgotPassword/GetCodePage";
import ResetPasswordPage from "../FamilleApp/Pages/ForgotPassword/ResetPasswordPage";


// import Register from "../Pages/Register/index";

import { createStackNavigator } from '@react-navigation/stack';

const AuthStack = createStackNavigator();

function AuthRoutes(){
    return (
        <AuthStack.Navigator>
            {/* Page Principal d'Authentification avec a proposition de se connecter comme senior ou membre de famille */}
            <AuthStack.Screen name='AuthHome' component={AuthHome} options={{ 
                title: "tabtab",
                headerStyle: {
                    backgroundColor: '#151515',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                }
            }}/>            
            {/* Page SignIn Senior */}
            <AuthStack.Screen name='SignInSenior' component={SignInSenior} options={{
                title: "Login",
                headerBackTitle: "Retour",
                headerStyle: {
                    backgroundColor: '#151515',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}/>
            {/* Page SignIn Famille */}
            <AuthStack.Screen name='SignInFamille' component={SignInFamille} options={{
                title: "Login",
                headerBackTitle: "Retour",
                // headerLeft: () => (
                //     <Button>Back</Button>
                // ),
                headerStyle: {
                    backgroundColor: '#151515',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}/>
            <AuthStack.Screen name="RegisterFamille" component={RegisterFamille} options={{
                title: "Register",
                headerBackTitle: "Retour",
                headerStyle: {
                    backgroundColor: '#151515',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}/>
            <AuthStack.Screen name="GetEmailPage" component={GetEmailPage} options={{
                title: "Reset Password",
                headerBackTitle: "Retour",
                headerStyle: {
                    backgroundColor: '#151515',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}/>
            <AuthStack.Screen name="GetCodePage" component={GetCodePage} options={{
                title: "Reset Password",
                headerBackTitle: "Retour",
                headerStyle: {
                    backgroundColor: '#151515',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}/>
            <AuthStack.Screen name="ResetPasswordPage" component={ResetPasswordPage} options={{
                title: "Reset Password",
                headerBackTitle: "Retour",
                headerStyle: {
                    backgroundColor: '#151515',
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