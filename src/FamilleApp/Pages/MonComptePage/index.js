import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Button, Image, TouchableOpacity, Linking, AppState, Alert, Modal, ScrollView } from 'react-native';
import AuthContext from "../../../contexts/auth";
import seniorsApi from "../../../api/app";
import axios from "axios";

// Photo Picker
import ImagePicker from 'react-native-image-crop-picker';

// Formik et RFNetchBlob
import { useFormik } from 'formik';
import RNFetchBlob from 'rn-fetch-blob';

// Modal
// import SimpleModal from '../../../components/SeniorModal';

// Picker Selector
// import {Picker} from '@react-native-picker/picker';
// import RNPickerSelect from 'react-native-picker-select';
// import {Picker} from '@react-native-community/picker';
// Send Remote Message
// import remoteMessagefunction from "../../../../remoteMessageFirebase/index2";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";//plus

export default function MonComptePage(props) {

    const { signed, loading, user, signOut } = useContext(AuthContext);
    const [ myUser, setMyUser ] = useState([]);

    // Photo Picker
    const [ imagePath, setImagePath ] = useState(null);
    const [ photo, setPhoto ] = useState(null)

    const [fileContent, setFileContent] = useState(null);
    const [fileUri, setFileUri] = useState(null);

    // Test Picker
    const [ language, setLanguage ] = useState("Java");

    // Modal Visibility
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    // Test FormData Save
    // const data = new FormData();
    // images.forEach((image, index) => {
    //     data.append(`file[${index}]`, {
    //         uri: Platform.OS === 'ios' ? `file:///${image.path}` : image.path,
    //         type: 'image/jpeg',
    //         name: 'image.jpg'
    //     });
    // });

    // axios({
    //     url: 'imageUploadUrl',
    //     method: 'POST',
    //     data,
    //     headers: { 'Content-Type': 'multipart/form-data' }
    // }).then((response) => {
    //     console.log('image upload response: ', response)
    // }).catch((error) => {
    //     console.log('image upload error: ', error)
    // });

    // End Test FormData Save

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
          RNFetchBlob.fetch('POST', `https://test.tabtab.eu/api/update-famille-photo/${user.user_id}`,{
            
            'Content-Type' : 'multipart/form-data',
          }, 
      [
        { 
           name : 'photo_profil', 
           filename : fileUri, 
           type:'image/jpeg', 
           data:    RNFetchBlob.wrap(fileContent)
        },
        // { 
        //    name : 'title', 
        //    data : values.title
        // },
            
          ]).then((resp) => {
            setIsModalVisible(false);
            Alert.alert("Upload success!");
            // console.warn(resp);
          }).catch((err) => {
            Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
          })
        }
      });
      // End Formik

    // const createFormData = (photo) => {
    //     const data = new FormData();
      
    //     data.append("photo", {
    //       name: photo.fileName,
    //       type: photo.type,
    //       uri:
    //         Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    //     });
      
    //     // Object.keys(body).forEach(key => {
    //     //   data.append(key, body[key]);
    //     // });
      
    //     return data;
    // }

    // handleUploadPhoto = () => {
    //     fetch("http://192.168.0.156:8000/update-famille-photo/16", {
    //       method: "POST",
    //       body: createFormData(photo)
    //     })
    //       .then(response => response.json())
    //       .then(response => {
    //         console.log("upload succes", response);
    //         alert("Upload success!");
    //         setPhoto(null);
    //       })
    //       .catch(error => {
    //         console.log("upload error", error);
    //         alert("Upload failed!");
    //       });
    // }

    // const getFamilleData = (data) => {
    //     axios.put(`http://192.168.0.156:8000/update-famille-photo/16`, {
    //         "headers": {
    //             'Content-Type': 'multipart/form-data',
    //         }, 
    //         data
    //     })
    //     .then( response => {
    //         // console.warn(response.data)
    //         setMyUser(response.data);
    //     });
    // }

    useEffect(() => {
        seniorsApi.get(`/get-famille/${user.user_id}`).then( response => {
            // console.warn(response.data)
            setMyUser(response.data);
        });

        // axios.get(`http://192.168.0.156:8000/get-famille/16`).then( response => {
        //     // console.warn(response.data)
        //     setMyUser(response.data);
        //     console.warn(response.data);
        // });
        return () => console.log('Changement de page (mon compte)')
    }, []);

    function handleSignOut(){
        signOut();
    }

    const changeModalVisible = (bool) => {
        setIsModalVisible(bool);
    };

    return (
        
        <View style={{height: "78%", display: props.display, alignItems: "center"}}>
            <ScrollView contentContainerStyle={{ alignItems: "center"}} style={{ flex: 1, marginBottom: 20, width: "100%" }} showsVerticalScrollIndicator={false}>
            {/* <Text>Mon Compte Page</Text> */}
            {/* Image */}
            {/* https://test.tabtab.eu/storage/images/${myUser?.photo_profil} */}
            <View style={{height: 170, width: 170, borderRadius: 100, marginTop: 100, marginBottom: 50, position: "relative"}}>
                { imagePath ? <Image source={{uri: imagePath}} style={{height: "100%", width: "100%", borderRadius: 100}} /> : <Image source={{uri: `https://test.tabtab.eu/storage/images/${myUser?.photo_profil}`}} style={{height: 170, width: 170, borderRadius: 100}} />
                }
                <TouchableOpacity style={{position: "absolute", zIndex: 2, height: "100%", width: "100%", borderRadius: 100, backgroundColor: 'rgba(40, 42, 53, .5)'}} onPress={() => setIsModalVisible(true)}>
                    <FontAwesome5 name="plus" style={{position: "absolute", bottom: "40%", left: "42%"}} size={31} color={"white"} solid/>
                    {/* <Text style={{position: "absolute", bottom: "42%", left: "47%"}}>+</Text> */}
                </TouchableOpacity>
            </View>
            {/* <Image source={{uri: `http://192.168.0.156:8000/storage/images/${myUser?.photo_profil}`}} style={{height: 170, width: 170, borderRadius: 100, marginTop: 100}} /> */}
            
            {/* <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={[
                    { label: 'Football', value: 'football' },
                    { label: 'Baseball', value: 'baseball' },
                    { label: 'Hockey', value: 'hockey' },
                ]}
            /> */}
            <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={() => setIsModalVisible(false)}>
                {/* <SimpleModal changeModalVisible={changeModalVisible} setData={setData} socket={socket} username={user.user_name} senior_name={senior.prenom} code={senior.code}/> */}
                <TouchableOpacity disabled={true} style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <View style={{height: 300, width: "90%", backgroundColor: 'white', borderRadius: 10, justifyContent: "space-around"}}>
                        <View style={{flex: 1, height: "30%", alignItems: "center", justifyContent: "center"}}>
                            <Text style={{marginHorizontal: 5, fontWeight: "bold", fontSize: 20}}>Modifier photo de profil</Text>
                        </View>
                        <View style={{width: "100%", height: "70%", justifyContent: "space-between", alignItems: "center"}}>
                            
                                <TouchableOpacity style={{backgroundColor: "#3b3b3b", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "80%"}} onPress={takePhotoFromCalera}>
                                    <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginVertical: 10, backgroundColor: "#3b3b3b", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "80%"}} onPress={choosePhotoFromLibrary}>
                                    <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}}>Gallery</Text>
                                </TouchableOpacity>
                            
                            <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                                <TouchableOpacity style={{marginVertical: 10, backgroundColor: "red", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "45%"}} onPress={() => setIsModalVisible(false)}>
                                    <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginVertical: 10, backgroundColor: "green", borderRadius: 10, justifyContent: "center", alignItems: "center", width: "45%"}} onPress={formik.handleSubmit}>
                                    <Text style={{color: "white", paddingVertical: 7, fontWeight: "bold", fontSize: 20}}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* BUTTON POUR CHANGER LA PHOTO */}
            {/* <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, marginVertical: 20, backgroundColor: "#2e2e2e", borderRadius: 10}} onPress={() => setIsModalVisible(true)}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>Modifier photo de profil</Text>
            </TouchableOpacity> */}

            {/* <Button title="Modifier photo de profil" onPress={() => {
                setIsModalVisible(true)
            }}/> */}
            {/* <View style={{height: 50, width: 100, justifyContent: "center", }}>
                <Picker
                    selectedValue={language}
                    // style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) =>
                        setLanguage(itemValue)
                    }>
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                </Picker>
            </View> */}
            
            
            {/* <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10, marginVertical: 10}} onPress={takePhotoFromCalera}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>Take New Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10}} onPress={choosePhotoFromLibrary}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>Choose New From Library</Text>
            </TouchableOpacity> */}
            {/* update photo */}
            {/* <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10}} onPress={formik.handleSubmit}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>update Photo</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10}} onPress={() => {
                Linking.openURL("seniorsApp://"); 
                // console.warn(AppState.currentState)
                // https://www.google.com
                // const url = 'seniorsApp://';
                // Linking.canOpenURL(url)
                // .then((supported) => {
                //     if (supported) {
                //         // Alert.alert("Supported");
                //         Linking.openURL(url);
                //     } else {
                //         Alert.alert(
                //         'Alert',
                //         'WhatsApp is not installed',
                //         );
                //     }
                // }).catch(error => console.warn(error));
                // send notification
                // console.warn(props.FBToken);
                // axios.post('https://senior-video-call.herokuapp.com/remote-message', {
                //     messageTitle: "Call de André",
                //     messageBody: "André vous appelle...",
                //     messageUser: "andre",
                //     firebaseTopic: "AndreSantos",
                // }).then(response => {
                //     // console.warn("response: " + response);
                // }).catch(error => {
                //     console.error("error: " + error);
                // });

                // remoteMessagefunction()
            }}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>Linking URL: </Text>
            </TouchableOpacity> */}
            
            
            {/* Nom du Senior */}
            <Text style={{fontWeight: "bold", fontSize: 20, marginVertical: 20}}>{myUser?.prenom} {myUser?.nom}</Text>

            <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2e2e2e", borderRadius: 10, marginTop: 50}} onPress={() => handleSignOut()}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>Me Déconnecter</Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
