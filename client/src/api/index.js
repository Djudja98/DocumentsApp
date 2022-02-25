import axios from 'axios';

const API = axios.create({ baseURL: 'https://localhost:5000'});

//prije svih requesta ubaci token u request
API.interceptors.request.use((req) =>{
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const getUsers = () => API.get('/users');

export const createUser = (newUser) => API.post('/users', newUser);

export const updateUser = (id, updatedUser) =>API.patch(`/users/${id}`, updatedUser);

export const deleteUser = (id) => API.delete(`/users/${id}`);

//login korisnika
export const signInAppKorisnici = (formData) => API.post('/auth/signinak', formData);

export const signInQrCodeAppKorisnici = (formData) => API.post('/auth/signinqr', formData);

//actions
export const getActions = () => API.get('/actions');