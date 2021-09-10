import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { authSeniorsApi } from "../../../api/auth";

// Photo Picker
import ImagePicker from 'react-native-image-crop-picker';

// Formik et RFNetchBlob
import { useFormik } from 'formik';
import RNFetchBlob from 'rn-fetch-blob';

export default function RegisterFamille({ navigation }) {
    const [ nom, setNom ] = useState("");
    const [ prenom, setPrenom ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ seniorCode, setSeniorCode ] = useState("");

    // Photo Picker
    const [ imagePath, setImagePath ] = useState(null);
    const [ photo, setPhoto ] = useState(null)

    const [fileContent, setFileContent] = useState(null);
    const [fileUri, setFileUri] = useState(null);

    handleRegisterFamille = () => {
        authSeniorsApi.post("/register-famille", {
            "nom": nom,
            "prenom": prenom,
            "email": email,
            "password": password,
            "senior_code": seniorCode
        }).then( response => {
            // console.warn("Famille Account Crée");
        }).catch( error => {
            console.error(error);
        });
    } 

    const takePhotoFromCalera = () => {
        // console.warn("Take Photo");
        ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        }).then(image => {
            // console.warn(image)
            if (image.path){
                setFileContent(image.path);
                setFileUri(image.path.toString());
                console.log(image.path);
                setImagePath(image.path);
            }
            // if (image.uri) {
            //     setPhoto(image);
            //     console.log(image.path);
            //     setImagePath(image.path);
            // }
        
        // var img = {
        //     uri : image.path,
        //     name: 'testRNImage.jpg',
        //     type: 'image/jpeg'
        // };
        // console.warn(image.path);
        // const data = new FormData();
        // // console.warn(data)
        // // images.forEach((image, index) => {
        // data.append(`file[0]`, {
        //     uri: Platform.OS === 'ios' ? `file:///${image.path}` : image.path,
        //     type: 'image/jpeg',
        //     name: 'photo_profil'
        // });
        // console.warn(data._parts[0][0])
        // });
        // console.warn(image.path);

        // axios({
        //     url: 'http://192.168.0.156:8000/update-famille-photo/16',
        //     method: 'PUT',
        //     data,
        //     headers: { 'Content-Type': 'multipart/form-data' }
        // }).then((response) => {
        //     console.log('image upload response: ', response)
        // }).catch((error) => {
        //     console.log('image upload error: ', error)
        // });
        // formdata.append("product[images_attributes[0][file]]", {uri: image.path, name: 'testRNImage.jpg', type: 'image/jpeg'})
        // getFamilleData(formData);
        });
        
    };

    const choosePhotoFromLibrary = () => {
        // console.warn("Choose Photo");
        ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
        }).then(image => {

            if (image.path){
                setFileContent(image.path);
                setFileUri(image.path.toString());
                console.log(image.path);
                setImagePath(image.path);
            }
        });
    };
    // End Photo Picker

    // Formik
    const formik = useFormik({
        initialValues: { title: '' },
        onSubmit: values => {
          RNFetchBlob.fetch('POST', `http://192.168.0.156:8000/api/register-famille`,{
            
            'Content-Type' : 'multipart/form-data',
          }, 
      [
        { 
           name : 'photo_profile', 
           filename : fileUri, 
           type:'image/jpeg', 
           data:    RNFetchBlob.wrap(fileContent)
        },
        {
            name: "nom",
            data: nom
        },
        {
            name: "prenom",
            data: prenom
        },
        {
            name: "email",
            data: email
        },
        {
            name: "password",
            data: password
        },
        {
            name: "senior_code",
            data: seniorCode
        },
        // { 
        //    name : 'title', 
        //    data : values.title
        // },
            
          ]).then((resp) => {
           Alert.alert("Upload success!");
            // console.warn(resp);
          }).catch((err) => {
            Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
          })
        }
      });
      // End Formik

    return (
        <>
            <StatusBar style="dark" backgroung="white" translucent={true} />
                <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text>Nom</Text>
                        <TextInput placeholder="Entrer votre nom" style={styled.input} placeholderTextColor="white" onChangeText={(text => {
                            setNom(text)
                        })} />
                        <Text>Prenom</Text>
                        <TextInput placeholder="Entrer votre prenom" style={styled.input} placeholderTextColor="white" onChangeText={(text => {
                            setPrenom(text)
                        })}/>
                        <Text>Email</Text>
                        <TextInput placeholder="Entrer votre email" style={styled.input} placeholderTextColor="white" onChangeText={(text => {
                            setEmail(text)
                        })}/>
                        <Text>Password</Text>
                        <TextInput secureTextEntry={true} placeholder="Entrer votre password" style={styled.input} placeholderTextColor="white" onChangeText={(text => {
                            setPassword(text)
                        })}/>
                        <Text>Senior Code</Text>
                        <TextInput placeholder="Entrer votre senior code" style={styled.input} placeholderTextColor="white" onChangeText={(text => {
                            setSeniorCode(text)
                        })}/>
                        <Text>Photo de Profil</Text>
                        <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10, marginVertical: 10}} onPress={takePhotoFromCalera}>
                            <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>Take New Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10}} onPress={choosePhotoFromLibrary}>
                            <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>Choose New From Library</Text>
                        </TouchableOpacity>
                        {/* update photo */}
                        {/* <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10}} onPress={formik.handleSubmit}>
                            <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>update Photo</Text>
                        </TouchableOpacity> */}
                        {/* <TextInput placeholder="Entrer votre senior code" style={styled.input} placeholderTextColor="white" onChangeText={(text => {
                            setSeniorCode(text)
                        })}/> */}

                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            {/* <Button title="Register" style={{fontSize: 28, }} color="grey" onPress={() => handleRegisterFamille()}/> */}
                            <Button title="Register" style={{fontSize: 28, }} color="grey" onPress={formik.handleSubmit}/>
                        </View>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Button title="Back" style={{fontSize: 28, }} color="grey" onPress={() => navigation.goBack()}/>
                        </View>
                    </View>
                </ScrollView>
            {/* <Container style={{flex: 1}}> */}
                {/* <Logo>MySeniors.be</Logo> */}
                {/* <Titre>
                    Phone Numbre
                </Titre> */}
                {/* <TextInput placeholder="Enter your email" style={styled.input} placeholderTextColor="white" /> */}

                {/* <Titre>
                    Password
                </Titre> */}
                {/* <TextInput secureTextEntry={true} placeholder="Enter your password" style={styled.input} placeholderTextColor="white"/>

                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Button title="Sing in" style={{fontSize: 28, }} color="grey"/>
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Button title="Register" style={{fontSize: 28, }} color="grey"/>
                </View> */}

            {/* </Container> */}
        </>
    )
}

const styled = StyleSheet.create({
    input: {
        height: 50, 
        paddingHorizontal: 20, 
        borderColor: "lightgrey", 
        backgroundColor: "grey",
        borderWidth: 2, 
        borderRadius: 15, 
        marginVertical: 20,
        width: "70%",
        color: "white"
    }
})
