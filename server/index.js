import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import limiter from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/files.js';
import actionRoutes from './routes/actions.js';
// da bi ovo radilo u package.json dodaj "type": "module",

//dodaj skriptu za start
//"start": "nodemon index.js"

//const express = require('express'); u starijim verzijama noda islo je ovako


const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true}));
app.use(express.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());

//maks 5 zahtjeva na 5 sekundi
app.use(limiter({
    windowMs: 5000,
    max: 5,
    message: {
        code: 429,
        message: 'Too many requests'
    }
}))

//CRUD na users
app.use('/users', userRoutes);

//Login
app.use('/auth', authRoutes);

app.use('/files', fileRoutes);

app.use('/actions', actionRoutes);

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/', (req,res,next)=>{
    res.send('hello from ssl server');
})

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app);

/*mongoose.connect(process.env.CONNECT_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`)))
.catch((error)=> console.log(error));*/

mongoose.connect(process.env.CONNECT_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> sslServer.listen(PORT, ()=> console.log(`Server running on port ${PORT} SSL ON`)))
.catch((error)=> console.log(error));

//sslServer.setTimeout(10*1000); timeout na sve requeste u slucaju da zatreba