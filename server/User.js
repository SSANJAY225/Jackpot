import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserDetailSchema = new mongoose.Schema({
    Email: { type: String, unique: true },
    Password: String,
})

const User = mongoose.models.User || mongoose.model('User', UserDetailSchema);

export default User;