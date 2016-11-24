import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  password: String,
});

export default mongoose.model('User', UserSchema)
