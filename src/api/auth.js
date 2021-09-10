import axios from 'axios'
// https://api-sound-app.herokuapp.com/api/auth/
const authApi = axios.create({
    baseURL: 'https://api-sound-app.herokuapp.com/api/auth/'
});

const authSeniorsApi = axios.create({
    baseURL: 'https://test.tabtab.eu/api/'
});
// http://192.168.0.156:8000/api/
// https://test.tabtab.eu/api/
export {authApi, authSeniorsApi};