import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

import UserModel from '../models/user.js';

//ovo treba izmjeniti nakon implementacije qrcoda
export const signinAppKorisnici = async (req, res)=>{
    const { secreatAscii, inputCode, username } = req.body;
    try{

        if(! speakeasy.totp.verify({
            secret: secreatAscii,
            encoding: 'ascii',
            token: inputCode,
        })) return res.status(404).json({message: "Unauthorized"});

        const existingUser = await UserModel.findOne({ username:username });
        const {password, ...other} = existingUser._doc;

        // za app korisnici msm. da ne trebaju privilegije i tip naloga i root dir vjv
        //MySecret treba da bude jace i da ide u .env fajl
        const token = jwt.sign({username: existingUser.username, id: existingUser._id, accountType: existingUser.accountType, myDirectory:existingUser.myDirectory, readAction: existingUser.readAction, createAction: existingUser.createAction, updateAction: existingUser.updateAction, deleteAction: existingUser.deleteAction}, 'MySecret', {expiresIn: "1h"});

        res.status(200).json({result: other, token});
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const sendQrCodeAppKorisnici = async (req, res)=>{
    const { username, password } = req.body;
    try{
        const existingUser = await UserModel.findOne({ username:username });
        if(!existingUser) return res.status(404).json({message: "User doesnt exist"});

        if(!(existingUser.accountType === 0)) return res.status(404).json({message: "Unauthorized"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        const secret = speakeasy.generateSecret({name: 'testSecret'});

        qrcode.toDataURL(secret.otpauth_url, function(err, data){
            res.status(200).json({secret:secret,  qrcode:data});
        })
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

// ovo je onaj konacni korak sa qrcodom 
export const signinAppDokumenti = async (req, res)=>{
    const { secreatAscii, inputCode, username } = req.body;
    try{

        if(! speakeasy.totp.verify({
            secret: secreatAscii,
            encoding: 'ascii',
            token: inputCode,
        })) return res.status(404).json({message: "Unauthorized"});

        const existingUser = await UserModel.findOne({ username:username });
        const {password, ...other} = existingUser._doc;

        //MySecret treba da bude jace i da ide u .env fajl
        const token = jwt.sign({username: existingUser.username, id: existingUser._id, accountType: existingUser.accountType, myDirectory:existingUser.myDirectory, readAction: existingUser.readAction, createAction: existingUser.createAction, updateAction: existingUser.updateAction, deleteAction: existingUser.deleteAction}, 'MySecret', {expiresIn: "1h"});

        res.status(200).json({result: other, token});
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

//ovo je onaj prvi korak kad zahtijevas qrcode
export const sendQrCodeAppDokumenti = async (req, res)=>{
    let ip = req.connection.remoteAddress;
    //let ip2 = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const { username, password } = req.body;
    try{
        const existingUser = await UserModel.findOne({ username:username });
        if(!existingUser) return res.status(404).json({message: "User doesnt exist"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        //ako nije dozvoljena ip adresa nemoj mu ni dozvoliti login
        if(((!existingUser.allowedIp == "0.0.0.0")  && !ip.endsWith(existingUser.allowedIp))){
            return res.status(404).json({message: "Not allowed IP address"});
        }

        const secret = speakeasy.generateSecret({name: 'testSecret'});

        qrcode.toDataURL(secret.otpauth_url, function(err, data){
            res.status(200).json({secret:secret,  qrcode:data});
        })
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}