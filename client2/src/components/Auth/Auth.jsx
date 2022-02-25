import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import {GoogleLogin} from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import Icon from './icon';
import no_img from '../../images/no_img.webp';

import * as api from '../../api/index.js';

const initialState = {username:'', password: ''};

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [qrcodeImg, setqrcodeImg] = useState("");
    const [secreatAscii, setsecreatAscii] = useState("");
    const [inputCode, setInputCode] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const { data } = await api.signInAppDokumenti({username:formData.username,secreatAscii, inputCode});
            localStorage.setItem('profile', JSON.stringify(data));
            navigate('/files');
            navigate('/files');
        }catch(error){
            console.log(error.message);
        }
    };

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleShowPassword = () =>{
        setShowPassword(!showPassword);
    }

    const handleGetQrCode = async () =>{
        try{
            const { data } = await api.signInQrCodeAppDokumenti(formData);
            setsecreatAscii(data.secret.ascii);
            setqrcodeImg(data.qrcode);
        }catch(error){
            console.log(error.message);
        }
    }

    const googleSuccess = async (res) =>{
        const result = res?.profileObj;
        const token = res?.tokenId;
        localStorage.setItem('profile', JSON.stringify({result, token}));
        navigate('/files');
        navigate('/files');
    };

    const googleFailure = () =>{
        console.log("google sign in error");
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" className={classes.textSignIn}>Sign in</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Input name="username" label="Username" handleChange={handleChange} type="username" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}  />
                    </Grid>
                    <Button fullWidth variant="contained" color="primary" className={classes.qrbutton}
                        onClick={handleGetQrCode}>
                        Get Qr code
                    </Button>
                    <TextField name="inputCode" label="Input Code" variant="outlined" className={classes.form} onChange={(e) => setInputCode(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        Sing in
                    </Button>
                    <GoogleLogin
                        clientId="910145212845-850dk9op83ohpol2bnntbqpbkr4c7veg.apps.googleusercontent.com"
                        render={(renderProps)=>(
                            <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant='contained'>Google Sign In</Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure} 
                        cookiePolicy='single_host_origin'
                    />
                </form>
                <img className={classes.img} src ={qrcodeImg || no_img} />
            </Paper>
        </Container>
    );
}
 
export default Auth;