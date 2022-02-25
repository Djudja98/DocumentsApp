import ActionModel from "../models/actions.js";

export const getActions = async (req, res)=>{
    if(!req.userId) return res.json({message: 'Unauthenticated'});
    if(!(req.accountType === 0)) return res.json({message: 'Unauthorized'});
    try{
        const actions = await ActionModel.find();
        res.status(200).json(actions);
    }catch(error){
        res.status(404).json({ message: 'Get actions went wrong'});
    }
}

export const createAction = async (req, res) =>{
    const action = req.body;
    if(!req.userId) return res.json({message: 'Unauthenticated'});

    try{
        const newAction = new ActionModel(action);
        await newAction.save();
        res.status(201).json(newAction);
    }catch(error){
        res.status(409).json({ message: 'Create action went wrong'});
    }
}