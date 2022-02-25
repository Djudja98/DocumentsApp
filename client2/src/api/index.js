import axios from 'axios';

const API = axios.create({ baseURL: 'https://localhost:5000'});

//prije svih requesta ubaci token u request
API.interceptors.request.use((req) =>{
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

//login korisnika
export const signInAppDokumenti = (formData) => API.post('/auth/signinad', formData);

export const signInQrCodeAppDokumenti = (formData) => API.post('/auth/signinqrad', formData);

//files 
export const getUserFiles = () => API.get('/files/list');

export const uploadFile = (data) => API.post('/files/upload',data);

export const deleteFile = (name) => API.delete(`/files/delete?file=${name}`);

export const moveFile = (data) => API.patch('/files/move', data);

export const createDir = (data) => API.post('/files/createDir',data);

export const deleteDir = (data) => API.post('/files/deleteDir', data);

//actions
export const createAction = (newAction) => API.post('/actions/create', newAction);