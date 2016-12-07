import mongoose, { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: String,
  password: String,
});

export default mongoose.model('User', UserSchema);
