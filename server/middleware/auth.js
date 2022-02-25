import jwt, { decode } from 'jsonwebtoken';

//auth middleware potvrdjuje identitet osobe uz jwt posto je u jwt username, id...
const auth = async (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; // da li je gugl acc ili ne

        let decodedData;
        if(token && isCustomAuth){
            decodedData = jwt.verify(token, 'MySecret');
            req.userId = decodedData?.id;
            req.accountType = decodedData?.accountType;
            req.myDirectory = decodedData?.myDirectory;
            req.readAction = decodedData?.readAction;
            req.createAction = decodedData?.createAction;
            req.deleteAction = decodedData?.deleteAction;
            req.allowedIp = decodedData?.allowedIp;
        }else{
            decodedData = jwt.decode(token); //google useru je dozvoljen file list i download
            req.userId = decodedData?.sub;
            req.isGoogle = true;
            req.myDirectory = "root/google";
            req.readAction = true;
        }
        next();
    }catch(error){
        console.log(error);
    }
}

export default auth;