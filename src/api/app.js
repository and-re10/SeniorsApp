import axios from 'axios'

const seniorsApi = axios.create({
    baseURL: 'https://test.tabtab.eu/api/'
    // baseURL: 'http://192.168.0.156:8000/'
});

export default seniorsApi;