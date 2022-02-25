import mongoose from 'mongoose';

const actionSchema = mongoose.Schema({
    username: String,
    documentName: String,
    type: String,
    date: String,
    }
);

const ActionModel = mongoose.model('ActionModel', actionSchema);

export default ActionModel;