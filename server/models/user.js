import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    accountType:{type: Number, required: true},
    myDirectory:String,
    allowedIp:String,
    readAction: Boolean,
    createAction: Boolean,
    updateAction: Boolean,
    deleteAction: Boolean,
});

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;