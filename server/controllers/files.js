import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';
import express from 'express';
import url from 'url';

//radi, ne diraj vise ni za zivu glavu
export const uploadFile = async (req,res) =>{
    let arrayTemp = req.body.file.split(",");
    let buffer = Buffer.from(arrayTemp[1], 'base64');
    let fileName = req.body.fileName;
    const dirName = req.myDirectory;
    const path = `./${dirName}/${fileName}`;
    try{
        const allowedUpload = req.createAction;
        if(!allowedUpload){
            return res.json({message: 'Unauthorized'});
        }
        await fsPromises.writeFile(path, buffer);
        res.status(200).json({message: "File Uploaded"});
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

//ovo bi sad trebalo da radi sve, u requestu imam Authorization token samo
//trebam jos na backendu provjeriti postoji li
export const downloadFile = async (req, res) =>{
    const queryObject = url.parse(req.url, true).query;
    const fileLocation = queryObject.dir;
    const tempArr = fileLocation.split("/");
    const fileName = tempArr[tempArr.length-1];

    try{
        const allowed = req.readAction;
        console.log(allowed);
        if(allowed){
            const fileExists = await fsPromises.stat(fileLocation);
            res.download(fileLocation, fileName);
        } 
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const listFiles = async (req, res)=>{
    const dirName = req.myDirectory;
    try{
        await fsPromises.stat(`./${dirName}`); //bacice error ako ne postoji
        let array = await walk(`./${dirName}`);
        array = array.map(member => member.replaceAll("\\", "/"));
        res.status(200).json(array);
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

async function walk(dir) {
    let files = await fsPromises.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fsPromises.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    }));

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

export const deleteFile = async (req, res) =>{
    const queryObject = url.parse(req.url, true).query;
    const fileLocation = queryObject.file;
    const dirName = req.myDirectory;
    if(!(`/${fileLocation}`).startsWith(dirName)){
        return res.json({message: 'Unauthorized'});
    }
    if(!req.deleteAction){
        return res.json({message: 'Unauthorized'});
    }
    try{
        await fsPromises.unlink(fileLocation);
        res.status(200).json({message: "Deleted"});
    }catch(error){
        res.status(404).json({message: "Something went wrong"});
    }
}

export const moveFile = async (req,res)=>{
    try{
        if(!(req.accountType === 1)) return res.json({message: 'Unauthorized'});

        const source = req.body.source;
        const tempArr = source.split("/");
        const fileName = tempArr[tempArr.length-1];
        const destination = `${req.body.destination}/${fileName}`;
        await fsPromises.rename(source, destination);
        res.status(200).json({message: "File moved"});
    }catch(error){
        res.status(404).json({message: "Something went wrong"});
    }
}

export const createDir = async(req, res)=>{
    if(!(req.accountType === 1)) return res.json({message: 'Unauthorized'});
    try{
        const source = req.body.source;
        await fsPromises.mkdir(source);
        res.status(200).json({message: "Directory created"});
    }catch(error){
        res.status(404).json({message: "Something went wrong"});
    }
    
}

export const deleteDir = async(req, res)=>{
    if(!(req.accountType === 1)) return res.json({message: 'Unauthorized'});
    try{
        const source = req.body.source;
        await fsPromises.rmdir(source);
        res.status(200).json({message: "Directory deleted"});
    }catch(error){
        res.status(404).json({message: "Something went wrong"});
    }
}