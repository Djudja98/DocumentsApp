import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from "../models/user.js";

export const getUsers = async (req, res) =>{
    if(!req.userId) return res.json({message: 'Unauthenticated'});
    if(!(req.accountType === 0)) return res.json({message: 'Unauthorized'});

    try{
        const users = await UserModel.find();
        res.status(200).json(users);
    }catch(error){
        res.status(404).json({ message: 'Get users went wrong'});
    }
}

export const createUser = async (req, res) =>{
    const user = req.body;

    if(!req.userId) return res.json({message: 'Unauthenticated'});
    if(!(req.accountType === 0)) return res.json({message: 'Unauthorized'});

    const newUser = new UserModel(user);
    const name = user.username;
    try{
        const existingUser = await UserModel.findOne({ username:name });
        if(existingUser) return res.status(400).json({message:"User already exists"});

        const hashedPassword = await bcrypt.hash(user.password, 12);
        newUser.password = hashedPassword;
        await newUser.save();
        res.status(201).json(newUser);
    }catch(error){
        res.status(409).json({ message: 'Create user went wrong'});
    }
}

export const updateUser = async (req, res) =>{
    const { id } = req.params;

    if(!req.userId) return res.json({message: 'Unauthenticated'});
    if(!(req.accountType === 0)) return res.json({message: 'Unauthorized'});

    const user = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('Not found');
    }
    try{
        const updatedUser = await UserModel.findByIdAndUpdate(id, user, {new:true});
        return res.status(200).json(updatedUser);
    }catch(error){
        res.status(409).json({ message: 'Update user went wrong'});
    }
}

export const deleteUser = async (req, res)=>{
    const {id} = req.params;

    if(!req.userId) return res.json({message: 'Unauthenticated'});
    if(!(req.accountType === 0)) return res.json({message: 'Unauthorized'});

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('Not found');
    }
    try{
        await UserModel.findByIdAndRemove(id);
        return res.status(200).json({message: 'Deleted'});
    }catch(error){
        res.status(404).json({ message: 'Delete user went wrong'});
    }
}