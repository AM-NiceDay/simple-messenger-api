import mongoose, { Schema } from 'mongoose';
import names from 'starwars-names';

export const UserSchema = new Schema({
  email: String,
  password: String,
  fullName: { type: String, default: names.random },
  photoUrl: { type: String, default: () => `https://github.com/identicons/${new Date().getMilliseconds()}.png` },
  status: { type: String, default: 'online' },
});

export default mongoose.model('User', UserSchema);
