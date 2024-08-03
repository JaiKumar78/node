import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : String, 
    email : String,
    age : Number
});

const userModel = mongoose.model('user', userSchema);

export default userModel;